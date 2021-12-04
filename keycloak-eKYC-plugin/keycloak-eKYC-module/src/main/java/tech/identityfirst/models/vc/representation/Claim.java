package tech.identityfirst.models.vc.representation;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Claim {
    private boolean essential;
    private String purpose;
    private String value;
    private String[] values;
}
