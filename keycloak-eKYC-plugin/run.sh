#!/usr/bin/env bash

mvn clean package
cp keycloak-eKYC-ear/target/keycloak-eKYC*.ear /home/kepuss/tmp/keycloak-10.0.0/standalone/deployments/
export GET_VC_ENDPOINT="http://localhost:5000/api/v1/idp/vc"
/home/kepuss/tmp/keycloak-10.0.0/bin/standalone.sh --debug 5005