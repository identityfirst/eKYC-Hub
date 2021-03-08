#!/bin/bash

IDP_HOST="172.17.0.1"
IDP_HOST="keycloak-ekyc"

ACCESS_TOKEN=$(curl --location --request POST "http://$IDP_HOST:8080/auth/realms/master/protocol/openid-connect/token" \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'username=admin' \
--data-urlencode 'password=admin' \
--data-urlencode 'client_id=admin-cli' \
--data-urlencode 'grant_type=password' | jq -r ".access_token")

curl --location --request POST "http://$IDP_HOST:8080/auth/admin/realms/demo/users" \
--header "Authorization: Bearer $ACCESS_TOKEN" \
--header 'Content-Type: application/json' \
--data-raw '{
	"username":"test",
    "firstName": "Joe",
    "lastName": "Doe",
    "email": "joe@example.com",
    "credentials":[
        {
           "type": "password",
           "value": "test123",
           "temporary": false
       }
    ],
    "enabled": "true"
}'

USER_ID=$(curl --location --request GET "http://$IDP_HOST:8080/auth/admin/realms/demo/users?username=test" \
--header "Authorization: Bearer $ACCESS_TOKEN" | jq -r ".[0].id")
