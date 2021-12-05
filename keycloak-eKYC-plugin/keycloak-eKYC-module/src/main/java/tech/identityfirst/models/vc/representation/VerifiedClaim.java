
package tech.identityfirst.models.vc.representation;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties
@JsonPropertyOrder({
    "verification",
    "claims"
})
@Data
public class VerifiedClaim {
    @JsonProperty("verification")
    private JsonNode verification;
    @JsonProperty("claims")
    private Map<String,Claim> claims;
}
