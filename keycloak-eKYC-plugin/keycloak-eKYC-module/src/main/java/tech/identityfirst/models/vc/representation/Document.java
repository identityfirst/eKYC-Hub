
package tech.identityfirst.models.vc.representation;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "type",
    "issuer",
    "number",
    "date_of_issuance",
    "date_of_expiry"
})
@Data
public class Document {

    @JsonProperty("type")
    public String type;
    @JsonProperty("issuer")
    public Issuer issuer;
    @JsonProperty("number")
    public String number;
    @JsonProperty("date_of_issuance")
    public String dateOfIssuance;
    @JsonProperty("date_of_expiry")
    public String dateOfExpiry;


}
