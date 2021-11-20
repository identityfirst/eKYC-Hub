package tech.identityfirst.authenticatorforms;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class VerifiedClaimsAuthenticatorFormTest {

    private String claims = "{\n" +
            "    \"userinfo\": {\n" +
            "        \"verified_claims\": {\n" +
            "            \"verification\": {\n" +
            "                \"trust_framework\":null,\n" +
            "                \"evidence\": [\n" +
            "                    {\n" +
            "                        \"type\": {\n" +
            "                            \"value\": \"id_document\"\n" +
            "                        },\n" +
            "                        \"method\": {\n" +
            "                            \"value\": \"uripp\"\n" +
            "                        },\n" +
            "                        \"document\": {\n" +
            "                            \"type\": null\n" +
            "                        }\n" +
            "                    }\n" +
            "                ]\n" +
            "            },\n" +
            "            \"claims\": {\n" +
            "                \"given_name\":{\n" +
            "                    \"essential\":true,\n" +
            "                    \"purpose\":\"To make communication look more personal\"\n" +
            "                },\n" +
            "                \"family_name\":{\n" +
            "                    \"essential\":true\n" +
            "                },\n" +
            "                \"birthdate\":{\n" +
            "                    \"purpose\":\"To send you best wishes on your birthday\"\n" +
            "                }\n" +
            "            }\n" +
            "        }\n" +
            "    }\n" +
            "}";

    @Test
    public void test(){
            Map<String,String> result = new HashMap<>();
            Map<String, Object> purposes =
                    JsonPath.parse(claims).read("$.userinfo.verified_claims.claims", Map.class);
            for(Map.Entry<String,Object> entry : purposes.entrySet()){
                Map<String,Object> claim = (Map<String, Object>) entry.getValue();
                if(claim.containsKey("purpose")){
                    result.put(entry.getKey(), (String) claim.get("purpose"));
                }
            }
            System.out.println(purposes);

    }
}
