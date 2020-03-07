package net.ibizsys.ocr.app.controller;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import net.ibizsys.ocr.ibizutil.domain.ActionResult;
import net.ibizsys.ocr.ibizutil.errors.BadRequestAlertException;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.ResponseEntity;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import lombok.Data;
import com.fasterxml.jackson.databind.node.ObjectNode;
import javax.servlet.http.HttpServletRequest;

@RestController
public class AppMenuController{

	@GetMapping(value="/ocrweb/ctrl/mainappmenu/get")
	public ResponseEntity<JsonNode> ocrwebMainGet(){
		JsonNode jsonNode;
		try{
			InputStream in = this.getClass().getResourceAsStream("/appmenu/ocrweb_main.json");
        	jsonNode = new ObjectMapper().readTree(in);
		}
		catch(Exception ex){
			 throw new BadRequestAlertException("操作发生错误","","");
		}
		return ResponseEntity.ok().body(jsonNode);
	}
	/**
	 * 系统预置服务接口
	 * @return
	 */
	@RequestMapping(value="/ocrweb/app/ocrweb/getappdata")
    public ResponseEntity<AppData> ocrwebGetAppData(@Validated HttpServletRequest request){
		AppData appData = new AppData();
    	return ResponseEntity.ok().body(appData);
    }
	@Data
	static protected class AppData{
		private String remotetag = null;
		private ObjectNode localdata = null;
	}
}
