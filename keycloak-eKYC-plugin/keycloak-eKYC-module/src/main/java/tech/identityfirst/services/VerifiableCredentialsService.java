package tech.identityfirst.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private Client client;
    private ObjectMapper mapper;

    public VerifiableCredentialsService(KeycloakSession session) {
        this.session = session;
        this.getVcEndpoint = System.getenv("GET_VC_ENDPOINT");
        this.getVcEndpoint = this.getVcEndpoint != null ? this.getVcEndpoint : "http://localhost:5000";
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
}
