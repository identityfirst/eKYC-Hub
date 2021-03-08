
package tech.identityfirst.models.vc.representation;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import javax.json.JsonObject;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "verification",
    "claims"
})
@Data
public class VerifiedClaims {


    public String id;
    @JsonProperty("verification")
    public Verification verification;
    @JsonProperty("claims")
    public Map<String,Object> claims;

    public Metadata metadata;
}
