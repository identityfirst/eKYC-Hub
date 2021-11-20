package tech.identityfirst.wellknown;

import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.protocol.oidc.OIDCWellKnownProviderFactory;
import org.keycloak.wellknown.WellKnownProvider;

public class VerifiableCredentialsWellKnownProviderFactory extends OIDCWellKnownProviderFactory {
    @Override
    public WellKnownProvider create(KeycloakSession session) {
        return new VerifiableCredentialsWellKnownProvider(session, getOpenidConfigOverride(), includeClientScopes());
    }

    private boolean includeClientScopes() {
        String includeClientScopesProp = System.getProperty("oidc.wellknown.include.client.scopes");
        return includeClientScopesProp == null || Boolean.parseBoolean(includeClientScopesProp);
    }

    @Override
    public void init(Config.Scope config) {
    }

    @Override
    public String getId() {
        return "custom-testsuite-oidc-well-known-factory";
    }

    @Override
    public String getAlias() {
        return OIDCWellKnownProviderFactory.PROVIDER_ID;
    }

    // Should be prioritized over default factory
    @Override
    public int getPriority() {
        return 1;
    }
}
