package tech.identityfirst.models.vc.representation;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "organization",
        "txn"
})
@Data
public class Verifier {
    @JsonProperty("organization")
    public String organization;
    @JsonProperty("txn")
    public String txn;
}
