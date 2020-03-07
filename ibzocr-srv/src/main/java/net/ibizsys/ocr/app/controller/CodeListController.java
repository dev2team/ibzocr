package net.ibizsys.ocr.app.controller;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import net.ibizsys.ocr.ibizutil.domain.ActionResult;
import net.ibizsys.ocr.ibizutil.domain.CodeList;
import net.ibizsys.ocr.ibizutil.errors.BadRequestAlertException;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.ResponseEntity;

@RestController
public class CodeListController{

	@Resource(name="ibzocr_SysOperatorCodeList")
	private net.ibizsys.ocr.ocr.codelist.SysOperatorCodeList ibzocr_ocrweb_SysOperatorCodeList;
	@RequestMapping("/ocrweb/app/codelist/ibzocr/sysoperator")
    public ResponseEntity<CodeList> ocrwebgetibzocr_SysOperatorCodeList(){
    	return ResponseEntity.ok().body(ibzocr_ocrweb_SysOperatorCodeList.getCodeList());
	}
	@RequestMapping("/ocrweb/app/codelist/getall")
    public ResponseEntity<List<CodeList>> ocrwebgetAll(){
     List<CodeList> list = new ArrayList<CodeList>();
    list.add(ibzocr_ocrweb_SysOperatorCodeList.getCodeList());
    	return ResponseEntity.ok().body(list);
	}
}