FROM jboss/keycloak:10.0.0
COPY keycloak-eKYC-ear/target/keycloak-eKYC-*.ear /opt/jboss/keycloak/standalone/deployments/
COPY ekyc-theme/ /opt/jboss/keycloak/themes/
EXPOSE 8787