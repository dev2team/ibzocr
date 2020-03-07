package net.ibizsys.ocr.ibizutil.client.uaa;

import com.alibaba.fastjson.JSONObject;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import javax.validation.constraints.NotBlank;
import java.util.Map;

@FeignClient(value = "uaaweb",fallbackFactory= UAAClientHytrix.class,configuration=UAAClientCfg.class)
@Service
public interface UAAClient
{
	@GetMapping(value = "/uaaweb/uaa/sys_role/custom/getpermission")
	JSONObject getPermission(@Validated @NotBlank(message = "userid不允许为空") @RequestParam("userid") String userid, @Validated @NotBlank(message = "systemid不允许为空") @RequestParam("systemid") String systemid);

	@PostMapping("/uaaweb/uaa/sys_role/custom/pushpermissiondata")
	Map<String,Object> pushpermissiondata(@RequestBody Map<String, Object> map, @Validated @NotBlank(message = "systemid不允许为空") @RequestParam("systemid") String systemid);

	@PostMapping(value = "/uaaweb/uaa/sys_role/custom/createuser")
	JSONObject createUser(@RequestBody JSONObject jsobject);

	@PostMapping(value = "uaaweb/uaa/sys_role/custom/updateuser")
	JSONObject updateUser(@RequestBody JSONObject jsobject);

	@PostMapping("/uaaweb/uaa/sys_role/custom/deleteuser")
	void deleteUser(@Validated @NotBlank(message = "userid不允许为空")@RequestParam("userid")String userid);
}
