const claims = {}

claims.any = {
    userinfo: {
        "verified_claims": {
            "verification": {
                "trust_framework":null,
                "evidence": [
                    {
                        "type": {
                            "value": "id_document"
                        },
                        "method": {
                            "value": "uripp"
                        },
                        "document": {
                            "type": null
                        }
                    }
                ]
            },
            "claims": {
                "given_name": null,
                "family_name": null,
                "birthdate": null
            }
        }
    }
}

claims.full = {
    userinfo: {
        "verified_claims": {
            "verification": {
                "trust_framework":null,
                "time":null,
                "verification_process":null,
                "evidence": [
                    {
                        "verifier": {
                            "organization": null,
                            "txn": null
                        },
                        "type": {
                            "value": "id_document"
                        },
                        "method": {
                            "value": "uripp"
                        },
                        "document": {
                            "type": null,
                            "issuer": {
                                "name": null
                            },
                            "number": null,
                            "date_of_issuance": null,
                            "date_of_expiry": null
                        },
                        "time":null
                    }
                ]
            },
            "claims": {
                "given_name": null,
                "family_name": null,
                "birthdate": null
            }
        }
    }
}

claims.birthdayFromDeAml = {
    userinfo: {
        "verified_claims": {
            "verification": {
                "trust_framework": {
                    value: "de_aml"
                }
            },
            "claims": {
                "birthdate": null
            }
        }
    }
}

claims.addressFromDeamlPippIdCardPassport = {
    "userinfo": {
        "verified_claims": {
            "verification": {
                "trust_framework": {
                    "value": "de_aml"
                },
                "evidence": [
                    {
                        "type": {
                            "value": "id_document"
                        },
                        "method": {
                            "value": "pipp"
                        },
                        "document": {
                            "type": {
                                "values": [
                                    "idcard",
                                    "passport"
                                ]
                            }
                        }
                    }
                ]
            },
            "claims": {
                "given_name": null,
                "address": null
            }
        }
    }
}

module.exports = claims