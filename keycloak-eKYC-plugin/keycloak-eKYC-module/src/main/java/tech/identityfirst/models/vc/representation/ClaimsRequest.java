package tech.identityfirst.models.vc.representation;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClaimsRequest {
    private VerifiedClaims userinfo;
    private VerifiedClaims id_token;
}
