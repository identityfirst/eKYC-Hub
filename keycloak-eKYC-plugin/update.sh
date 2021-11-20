#!/usr/bin/env bash

mvn clean package
docker cp keycloak-eKYC-ear/target/keycloak-eKYC*.ear ekyc-hub_keycloak-ekyc_1:/opt/jboss/keycloak/standalone/deployments/
