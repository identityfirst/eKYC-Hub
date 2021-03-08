
package tech.identityfirst.models.vc.representation;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "verification",
    "claims"
})
@Data
@AllArgsConstructor
public class OIDCVerifiedClaims {

    @JsonProperty("verification")
    public Verification verification;
    @JsonProperty("claims")
    public Map<String,Object> claims;
}
