package tech.identityfirst.authenticatorforms;

import lombok.SneakyThrows;
import lombok.extern.jbosslog.JBossLog;
import org.jboss.logging.Logger;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.authenticators.conditional.ConditionalAuthenticator;
import org.keycloak.authentication.authenticators.conditional.ConditionalUserConfiguredAuthenticator;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;

@JBossLog
public class ConditionalVerifiedClaimsAuthenticatorForm implements ConditionalAuthenticator {

    private static final Logger LOG = Logger.getLogger(ConditionalVerifiedClaimsAuthenticatorForm.class);
    public static final ConditionalVerifiedClaimsAuthenticatorForm SINGLETON = new ConditionalVerifiedClaimsAuthenticatorForm();

    public ConditionalVerifiedClaimsAuthenticatorForm() {
    }

    @Override
    public boolean matchCondition(AuthenticationFlowContext context) {
        String claims = context.getAuthenticationSession().getClientNote("claims");
        if(claims == null || !claims.contains("verified_claims")){
            context.getAuthenticationSession().setUserSessionNote("vc","false");
            return false;
        }
        context.getAuthenticationSession().setUserSessionNote("vc","true");
        return true;
    }

    @SneakyThrows
    @Override
    public void action(AuthenticationFlowContext context) {
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