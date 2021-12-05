package tech.identityfirst.authenticatorforms;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.JsonPath;
import lombok.SneakyThrows;
import lombok.extern.jbosslog.JBossLog;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.jboss.logging.Logger;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.Authenticator;
import org.keycloak.forms.account.freemarker.model.UrlBean;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakUriInfo;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.theme.Theme;
import tech.identityfirst.models.vc.representation.ClaimsRequest;
import tech.identityfirst.services.VerifiableCredentialsService;

import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriBuilder;
import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@JBossLog
public class VerifiedClaimsAuthenticatorForm implements Authenticator {

    private static final Logger LOG = Logger.getLogger(VerifiedClaimsAuthenticatorForm.class);
    private final KeycloakSession session;
    private ObjectMapper objectMapper;

    public VerifiedClaimsAuthenticatorForm(KeycloakSession session) {
        this.session = session;
        this.objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @SneakyThrows
    @Override
    public void authenticate(AuthenticationFlowContext context) {

        String claims = session.getContext().getAuthenticationSession().getClientNote("claims");

        if(claims == null){
            context.success();
            return;
        }

        ClaimsRequest claimsRequest = objectMapper.readValue(claims,ClaimsRequest.class);

        Map<String,String> claimPurposes = getClaimsPurposes(claimsRequest);
        String purpose = session.getContext().getAuthenticationSession().getClientNote("client_request_param_purpose");
        String userId = session.getContext().getAuthenticationSession().getAuthenticatedUser().getId();
        log.infof("Verified credentials requested for user: %s",userId);
        VerifiableCredentialsService vcService = new VerifiableCredentialsService(session);


        List<JsonNode> vcs = new ArrayList<>();

        boolean hasUserinfo = !ObjectUtils.isEmpty(claimsRequest.getUserinfo());
        boolean hasIdToken= !ObjectUtils.isEmpty(claimsRequest.getId_token());

        if( hasUserinfo){
            log.info("Requesting vcs for userinfo");
            ObjectNode userinfoRequest =  objectMapper.createObjectNode();
            userinfoRequest.putPOJO("userinfo", claimsRequest.getUserinfo());
            vcs = vcService.getFilteredVerifiableCredentialsByUserId(userId,userinfoRequest);
        } else if (hasIdToken){
            log.info("Requesting vcs for id_token");
            ObjectNode idTokenRequest =  objectMapper.createObjectNode();
            idTokenRequest.putPOJO("id_token", claimsRequest.getId_token());
            vcs = vcService.getFilteredVerifiableCredentialsByUserId(userId,idTokenRequest);
        }

        log.info(String.format("Received %d vcs from idv hub",vcs.size()));


        List<VerifiableCredentialSelection> selectionVcs = vcs.stream().flatMap(vc-> {
            return getSelectionList(vc).stream();
        }).collect(Collectors.toList());



        UrlBean urlBean = getUrlBean(context);
        Response response = context.form()
                .setAttribute("username", context.getAuthenticationSession().getAuthenticatedUser().getUsername())
                .setAttribute("appName", StringUtils.defaultIfEmpty(context.getAuthenticationSession().getClient().getName(),"Unnamed"))
                .setAttribute("purpose", StringUtils.defaultIfEmpty(purpose,"Not provided"))
                .setAttribute("claimPurposes", objectMapper.writeValueAsString(claimPurposes))
                .setAttribute("vcs",objectMapper.writeValueAsString(selectionVcs))
                .setAttribute("accountUrl", urlBean.getAccountUrl())
                .setAttribute("notEnoughError", vcs.isEmpty())
                .createForm("vc-form2.ftl");

        context.getAuthenticationSession().setUserSessionNote("selectionVcs",objectMapper.writeValueAsString(selectionVcs));
        context.getAuthenticationSession().setUserSessionNote("availableVcs",objectMapper.writeValueAsString(vcs));
        context.getAuthenticationSession().setUserSessionNote("hasUserinfo",objectMapper.writeValueAsString(hasUserinfo));
        context.getAuthenticationSession().setUserSessionNote("hasIdToken",objectMapper.writeValueAsString(hasIdToken));
        context.challenge(response);
    }


    private UrlBean getUrlBean(AuthenticationFlowContext context) throws IOException {
        KeycloakUriInfo uriInfo = session.getContext().getUri();

        UriBuilder baseUriBuilder = uriInfo.getBaseUriBuilder();
        for (Map.Entry<String, List<String>> e : uriInfo.getQueryParameters().entrySet()) {
            baseUriBuilder.queryParam(e.getKey(), e.getValue().toArray());
        }
        URI baseQueryUri = baseUriBuilder.build();

        return new UrlBean(context.getRealm(),
                session.theme().getTheme(Theme.Type.ACCOUNT),
                session.getContext().getUri().getBaseUri(),
                baseQueryUri,
                uriInfo.getRequestUri(),
                null);
    }

    private Map<String,String> getClaimsPurposes(ClaimsRequest claims){
        Map<String,String> result = new HashMap<>();

        if(Optional.ofNullable(claims.getId_token()).isPresent()){
            claims.getId_token().getVerifiedClaims().getClaims().entrySet()
                    .stream().filter(e->!StringUtils.isEmpty(e.getValue().getPurpose()))
                    .forEach(e -> result.put(e.getKey(),e.getValue().getPurpose()));
        }

        if(Optional.ofNullable(claims.getUserinfo()).isPresent()){
            claims.getUserinfo().getVerifiedClaims().getClaims().entrySet()
                    .stream().filter(e->!StringUtils.isEmpty(e.getValue().getPurpose()))
                    .forEach(e -> result.put(e.getKey(),e.getValue().getPurpose()));
        }
        return result;
    }

    private List<VerifiableCredentialSelection> getSelectionList(JsonNode vc){
        String source = vc.get("metadata").get("source").asText();
        String document = vc.get("metadata").get("document").asText();
        String id = vc.get("id").asText();
        List<VerifiableCredentialSelection> verifiableCredentialSelections = new ArrayList<>();
        vc.get("claims").fields().forEachRemaining(entry -> verifiableCredentialSelections.add(
                mapClaim(entry.getKey(),entry.getValue().asText(),
                        UUID.randomUUID().toString(),
                        id,
                        source,
                        document)));
        return verifiableCredentialSelections;
    }

    private VerifiableCredentialSelection mapClaim(String key, String value,String id,String vcId, String provider, String source){
        VerifiableCredentialSelection selection = new VerifiableCredentialSelection();
        selection.setId(id);
        selection.setVcId(vcId);
        selection.setName(key);
        selection.setSource(provider);
        selection.setDocument(source);
        selection.setValue(value);
        return selection;
    }

    @SneakyThrows
    @Override
    public void action(AuthenticationFlowContext context) {
        MultivaluedMap<String, String> formData = context.getHttpRequest().getDecodedFormParameters();
//        session.getContext().getAuthenticationSession().setClientNote("selectedVcs",URLDecoder.decode(formData.getFirst("selected"),StandardCharsets.UTF_8.name()));
        session.getContext().getAuthenticationSession().setUserSessionNote("selectedVcs",URLDecoder.decode(formData.getFirst("selected"),StandardCharsets.UTF_8.name()));
        context.success();
    }

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return true;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {
    }

    @Override
    public void close() {
        // NOOP
    }

}
