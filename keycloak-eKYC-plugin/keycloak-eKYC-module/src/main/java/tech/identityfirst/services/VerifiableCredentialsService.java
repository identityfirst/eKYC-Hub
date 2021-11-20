package tech.identityfirst.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.jbosslog.JBossLog;
import org.apache.http.HttpStatus;
import org.keycloak.models.KeycloakSession;
import tech.identityfirst.models.vc.representation.VerifiedClaims;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Response;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@JBossLog
public class VerifiableCredentialsService {
    private final KeycloakSession session;
    private String getVcEndpoint;
    private String getWellKnownEndpoint;
    private Client client;
    private ObjectMapper mapper;
    private String VC_PATH="%s/api/v1/idp/vc";
    private String WELL_KNOWN_PATH="%s/.well-known/openid-configuration";

    public VerifiableCredentialsService(KeycloakSession session) {
        this.session = session;
        String idvUrl = System.getenv("IDV_URL") != null ? System.getenv("IDV_URL") : "http://localhost:5000";;
        this.getVcEndpoint = String.format(VC_PATH,idvUrl);
        this.getWellKnownEndpoint = String.format(WELL_KNOWN_PATH,idvUrl);
        this.client  = ClientBuilder.newClient();
        this.mapper = new ObjectMapper();
    }

    public List<JsonNode> getFilteredVerifiableCredentialsByUserId(String userId, String claims){
        return getExternalVc(userId, claims);
    }

    private List<JsonNode> getExternalVc(String userId, String claims){
        List<JsonNode> vcs = new ArrayList<>();
        try {
        Response response = client
                .target(this.getVcEndpoint+"/"+userId)
                .queryParam("claims",URLEncoder.encode(claims, StandardCharsets.UTF_8.toString()))
                .request()
                .get();
        if(response.getStatus() != HttpStatus.SC_OK){
            log.error("Get vc failed: "+response.toString());
            return new ArrayList<>();
        }
        String data = response.readEntity(String.class);
            vcs = mapper.readValue(data, mapper.getTypeFactory().constructCollectionType(List.class, JsonNode.class));
        } catch (JsonProcessingException e) {
            log.error("Vc parsing error",e);
            return new ArrayList<>();
        } catch (Exception e) {
            log.error("getting External VC exception", e);
            return new ArrayList<>();
        }
        return vcs;
    }
    public JsonNode getWellKnown(){
        try {
            Response response = client
                    .target(this.getWellKnownEndpoint)
                    .request()
                    .get();
            if(response.getStatus() != HttpStatus.SC_OK){
                log.error("Get well-known failed: "+response.toString());
                return mapper.createObjectNode();
            }
            String data = response.readEntity(String.class);
            JsonNode wellKnown = mapper.readValue(data, JsonNode.class);
            return wellKnown;
        } catch (JsonProcessingException e) {
            log.error("well-known parsing error",e);
            return mapper.createObjectNode();
        } catch (Exception e) {
            log.error("getting External well-known exception", e);
            return mapper.createObjectNode();
        }
    }
}
