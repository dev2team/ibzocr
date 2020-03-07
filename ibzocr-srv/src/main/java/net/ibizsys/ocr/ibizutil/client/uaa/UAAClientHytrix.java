package net.ibizsys.ocr.ibizutil.client.uaa;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import feign.FeignException;
import feign.hystrix.FallbackFactory;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

@Component
public class UAAClientHytrix implements FallbackFactory<UAAClient> {
    @Override
    public UAAClient create(Throwable cause) {
        JSONObject jo = new JSONObject();
        jo.put("ret",	 1) ;
        if(cause instanceof FeignException) {
            FeignException ex = (FeignException)cause ;
            jo.put("error", "[DST微服务订阅]异常。错误状态：" + ex.status()+"."+cause.getMessage());
        }else{
            jo.put("error", "[DST微服务订阅]异常。错误：" + cause.getMessage());
        }
        return new UAAClient() {

            @Override
            public JSONObject getPermission(@NotBlank(message = "userid不允许为空") String userid, @Validated @NotBlank(message = "systemid不允许为空") @RequestParam("systemid") String systemid) {
                return null;
            }

            @Override
            public Map<String,Object> pushpermissiondata(@RequestBody Map<String,Object> map,@Validated @NotBlank(message = "systemid不允许为空")@RequestParam("systemid")String systemid) {
                  return null;
            }

            @Override
            public JSONObject createUser(JSONObject jsobject) {
                return null;
            }

            @Override
            public JSONObject updateUser(JSONObject jsobject) {
                return null;
            }

            @Override
            public void deleteUser(@NotBlank(message = "userid不允许为空") String userid) {

            }


        };
    }
}
