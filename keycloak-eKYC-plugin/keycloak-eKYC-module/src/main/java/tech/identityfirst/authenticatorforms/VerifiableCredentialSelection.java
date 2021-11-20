package tech.identityfirst.authenticatorforms;

import lombok.Data;

import java.util.Set;

@Data
public class VerifiableCredentialSelection {
    private String id;
    private String vcId;
    private String name;
    private String purpose;
    private Object value;
    private String source;
    private String document;
}
