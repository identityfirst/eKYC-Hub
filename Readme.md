# eKYC Hub
This repository provides code for eKYC Hub application. The eKYC Hub implements the eKYC OIDC specification
[OpenID Connect for Identity Assurance 1.0](https://openid.net/specs/openid-connect-4-identity-assurance-1_0-ID2.html) and allows 
for the integration with eKYC data providers (verification services).

The code mainly provides the following:
1) Provides an integration layer between the IDP and the different verification services -  this allows for the user to verify different data attributes and store them within the Hub.
2) Provides an interface allowing clients to request and receive verified attributes from the Identity Provider using the standard OpenID Connect for Identity Assurance protocol.

In the repository, you can also find a demo client application as well as an example integration of the eKYC Hub with an open source Identity Provider - KeyCloak. You will need to have Docker installed to run the demo.

The eKYC Hub has been implemented with [Passbase](https://passbase.com/) - one of the easy-to-use verification services which provides an SDK and RESTful API for verifying end user data. Other providers can be used depending on requirements.

All provided code is open-source and available under the Apache 2.0 license.

For more information and other open-source identity software, visit https://identityfirst.tech

# eKYC Hub Setup

Below you can find instructions on how to setup the demo:

## Local setup

Install jq (only for set_user script)

Put domain mapping in you hosts file:
```aidl
127.0.0.1       idv-hub
127.0.0.1       demo-rp
127.0.0.1       keycloak-ekyc
```

Create .env file
```aidl
PASSBASE_SECRET_KEY=<SECRET_KEY>
PASSBASE_PUBLIC_KEY=<PUBLIC_KEY>
```

Note: You will need to register at Passbase and obtain a public key and a secret in order to integrate the current version of eKYC Hub.

Init SSL certificates:
```aidl
./gen_key_pair.sh.sh
```

To start, run
```aidl
docker-compose up
```

Init user in IDP:
```aidl
./set_user.sh
```

Demo RP url:
http://demo-rp:3000

User credentials: test/test123

## Add verified credentials
1. Go to IDP account url [https://keycloak-ekyc:8443/auth/realms/demo/account/](https://keycloak-ekyc:8443/auth/realms/demo/account/)
2. Go to Verified Credentials tab
3. Trigger verification with Provider

# Note
The [OpenID Connect for Identity Assurance 1.0](https://openid.net/specs/openid-connect-4-identity-assurance-1_0-ID2.html) specification is constantly evolving and e will make our best effort to keep the code up to date. However, there may be some differences between the current version of the spec and the code available in this repo - if you see one, we would welcome a pull request!