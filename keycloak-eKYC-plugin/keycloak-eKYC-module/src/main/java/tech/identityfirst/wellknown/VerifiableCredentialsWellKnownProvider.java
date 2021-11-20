package tech.identityfirst.wellknown;

import com.fasterxml.jackson.databind.JsonNode;
import org.keycloak.models.KeycloakSession;
import org.keycloak.protocol.oidc.OIDCWellKnownProvider;
import org.keycloak.protocol.oidc.representations.OIDCConfigurationRepresentation;
import org.keycloak.wellknown.WellKnownProvider;
import tech.identityfirst.services.VerifiableCredentialsService;

import java.util.Iterator;
import java.util.Map;

public class VerifiableCredentialsWellKnownProvider extends OIDCWellKnownProvider {

    private final KeycloakSession session;

    public VerifiableCredentialsWellKnownProvider(KeycloakSession session, Map<String, Object> openidConfigOverride, boolean includeClientScopes) {
        super(session, openidConfigOverride, includeClientScopes);
        this.session = session;
    }

    @Override
    public Object getConfig() {
        OIDCConfigurationRepresentation config = (OIDCConfigurationRepresentation) super.getConfig();
        VerifiableCredentialsService vcService = new VerifiableCredentialsService(session);
        JsonNode vcWellKnown = vcService.getWellKnown();
        Iterator<Map.Entry<String, JsonNode>>  vcWellKnownIterator = vcWellKnown.fields();
        while(vcWellKnownIterator.hasNext()){
            Map.Entry<String, JsonNode> entry = vcWellKnownIterator.next();
            config.getOtherClaims().put(entry.getKey(), entry.getValue());
        }
        return config;
    }
}
