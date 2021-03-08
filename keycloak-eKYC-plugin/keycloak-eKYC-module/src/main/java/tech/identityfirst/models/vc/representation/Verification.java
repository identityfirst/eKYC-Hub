
package tech.identityfirst.models.vc.representation;

import java.util.HashMap;
import java.util.List;
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
    "trust_framework",
    "time",
    "verification_process",
    "evidence"
})
@Data
public class Verification {

    @JsonProperty("trust_framework")
    public String trustFramework;
    @JsonProperty("time")
    public String time;
    @JsonProperty("verification_process")
    public String verificationProcess;
    @JsonProperty("evidence")
    public List<Evidence> evidence = null;

}
