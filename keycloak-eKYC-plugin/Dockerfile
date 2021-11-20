FROM jboss/keycloak:15.0.2
COPY keycloak-eKYC-ear/target/keycloak-eKYC-*.ear /opt/jboss/keycloak/standalone/deployments/
COPY ekyc-theme/ /opt/jboss/keycloak/themes/
EXPOSE 8787
