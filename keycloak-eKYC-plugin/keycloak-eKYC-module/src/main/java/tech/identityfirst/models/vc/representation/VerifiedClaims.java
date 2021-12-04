
package tech.identityfirst.models.vc.representation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;

import javax.json.JsonObject;


@Data
public class VerifiedClaims {
    @JsonProperty("verified_claims")
    private VerifiedClaim verifiedClaims;
}
