
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

import javax.json.JsonObject;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "type",
    "method",
    "time",
    "document",
    "provider",
    "date"
})
@Data
public class Evidence {

    @JsonProperty("type")
    public String type;

//    -------------id_document----------
    @JsonProperty("method")
    public String method;
    @JsonProperty("verifier")
    public Verifier verifier;
    @JsonProperty("time")
    public String time;
    @JsonProperty("document")
    public Document document;

//    -----------utility_bill-------------
    @JsonProperty("provider")
    public Map<String,Object> provider;
    @JsonProperty("date")
    public String date;

//    ---------------qes---------------
    @JsonProperty("issuer")
    public String issuer;
    @JsonProperty("serial_number")
    public String serialNumber;
    @JsonProperty("created_at")
    public String createdAt;
}
