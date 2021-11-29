package tech.identityfirst.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.fasterxml.jackson.databind.type.TypeFactory;
import lombok.SneakyThrows;
import lombok.extern.jbosslog.JBossLog;
import org.keycloak.models.ClientSessionContext;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.ProtocolMapperModel;
import org.keycloak.models.UserSessionModel;
import org.keycloak.protocol.oidc.mappers.*;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.IDToken;
import tech.identityfirst.authenticatorforms.VerifiableCredentialSelection;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@JBossLog
public class VerifiableCredentialsMapper  extends AbstractOIDCProtocolMapper implements OIDCAccessTokenMapper, OIDCIDTokenMapper, UserInfoTokenMapper {

    private static final List<ProviderConfigProperty> configProperties = new ArrayList<ProviderConfigProperty>();
    private ObjectMapper mapper;

    static {
        OIDCAttributeMapperHelper.addIncludeInTokensConfig(configProperties, VerifiableCredentialsMapper.class);
    }

    public VerifiableCredentialsMapper() {
        this.mapper = new ObjectMapper();
    }

    public static String getModelPropertyName(String claimName) {
        return "user.attribute." + claimName;
    }

    public static final String PROVIDER_ID = "oidc-address-mapper";

    public static ProtocolMapperModel createAddressMapper() {
        return createAddressMapper(true, true, true);
    }

    public static ProtocolMapperModel createAddressMapper(boolean idToken, boolean accessToken, boolean userInfo) {
        Map<String, String> config;
        ProtocolMapperModel address = new ProtocolMapperModel();

        config = new HashMap<>();
        config.put(OIDCAttributeMapperHelper.INCLUDE_IN_ACCESS_TOKEN, Boolean.toString(accessToken));
        config.put(OIDCAttributeMapperHelper.INCLUDE_IN_ID_TOKEN, Boolean.toString(idToken));
        config.put(OIDCAttributeMapperHelper.INCLUDE_IN_USERINFO, Boolean.toString(userInfo));

        address.setConfig(config);
        return address;
    }


    public List<ProviderConfigProperty> getConfigProperties() {
        return configProperties;
    }

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayType() {
        return "Verifiable credentials";
    }

    @Override
    public String getDisplayCategory() {
        return TOKEN_MAPPER_CATEGORY;
    }

    @Override
    public String getHelpText() {
        return "Maps verifiable credentials";
    }

    @SneakyThrows
    @Override
    public IDToken transformIDToken(IDToken token, ProtocolMapperModel mappingModel, KeycloakSession session,
                                    UserSessionModel userSession, ClientSessionContext clientSessionCtx) {
        Map<String,String> notes = userSession.getNotes();
        if(isNotVcFlow(notes)){
            return token;
        }

        List<JsonNode> resultClaims = getResultClaims(notes);
        log.info("Result claims "+ mapper.writeValueAsString(resultClaims));
        if(!resultClaims.isEmpty()) {
            token.getOtherClaims().put("verified_claims", resultClaims);
        }
        return token;
    }

    @SneakyThrows
    @Override
    public AccessToken transformUserInfoToken(AccessToken token, ProtocolMapperModel mappingModel, KeycloakSession session, UserSessionModel userSession, ClientSessionContext clientSessionCtx) {

        Map<String,String> notes = userSession.getNotes();
        if(isNotVcFlow(notes)){
            return token;
        }

        List<JsonNode> resultClaims = getResultClaims(notes);
        log.info("Result claims "+ mapper.writeValueAsString(resultClaims));
        if(!resultClaims.isEmpty()){
            token.getOtherClaims().put("verified_claims", resultClaims);
        }
        return token;
    }

    private boolean isNotVcFlow(Map<String,String> notes){
        return !Boolean.valueOf(notes.get("vc")) || notes.get("selectedVcs") == null
                || notes.get("availableVcs") == null || notes.get("selectionVcs") == null;
    }

    private List<JsonNode> getResultClaims(Map<String, String> notes) throws JsonProcessingException {
        List<String> selectedIds = this.getListFromNotes(notes,"selectedVcs",String.class);
        List<JsonNode> availableVcs = this.getListFromNotes(notes,"availableVcs",JsonNode.class);
        List<VerifiableCredentialSelection> selectionVcs = this.getListFromNotes(notes,"selectionVcs",VerifiableCredentialSelection.class);

        log.info("SelectedIds "+ mapper.writeValueAsString(selectedIds));
        log.info("AvailableVcs "+ mapper.writeValueAsString(availableVcs));
        log.info("selectionVcs "+ mapper.writeValueAsString(selectionVcs));

        Map<String,List<VerifiableCredentialSelection>> selectedVcs =
                selectionVcs.stream()
                .filter(svc-> selectedIds.contains(svc.getId()))
                        .collect(groupingBy(VerifiableCredentialSelection::getVcId));

        List<JsonNode> resultClaims = availableVcs.stream()
                .filter(avc -> selectedVcs.keySet().contains(avc.get("id").asText()))
                .map(avc -> mapSelectedClaims(avc,selectedVcs.get(avc.get("id").asText())))
                .collect(Collectors.toList());
        return resultClaims;
    }

    private JsonNode mapSelectedClaims(JsonNode avc, List<VerifiableCredentialSelection> vcss){
        Set<String> avcClaims = new HashSet<>();
        avc.get("claims").fieldNames().forEachRemaining(avcClaims::add);
        Set<String> vcsClaims = vcss.stream().map(vcs->vcs.getName()).collect(Collectors.toSet());

        Set<String> claimsToRemove = avcClaims.stream()
                .filter(avcClaim -> !vcsClaims.contains(avcClaim))
                .collect(Collectors.toSet());
        claimsToRemove.stream().forEach(claim->{
            ObjectNode objectNode = (ObjectNode) avc.get("claims");
            objectNode.remove(claim);
        });
        ((ObjectNode) avc).remove("id");
        ((ObjectNode) avc).remove("metadata");
        return avc;
    }

    private <T> List<T> getListFromNotes(Map<String,String> notes,String key, Class<T> clazz){
        CollectionType stringList = TypeFactory.defaultInstance().constructCollectionType(List.class, clazz);
        List<T> parsedList = new ArrayList<>();
        try{
            parsedList = mapper.readValue(notes.get(key),stringList);
        } catch (JsonProcessingException e) {
            log.error(e);
        }
        return parsedList;
    }
}
