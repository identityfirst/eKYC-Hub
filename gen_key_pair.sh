#!/bin/bash

openssl req -x509 -nodes -subj '/CN=keycloak-ekyc'  -newkey rsa:4096 -keyout ./tls.key -out ./tls.crt -days 365
openssl req -x509 -nodes -subj '/CN=idv-hub'  -newkey rsa:4096 -keyout ./idv-tls.key -out ./idv-tls.crt -days 365