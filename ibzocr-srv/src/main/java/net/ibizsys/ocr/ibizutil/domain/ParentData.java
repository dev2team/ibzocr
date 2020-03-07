package net.ibizsys.ocr.ibizutil.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;
/**
 * 
 *  父数据对象
 *
 */
 @Data
@JsonInclude(Include.NON_NULL)
public class ParentData {

	private String srfparentkey;
	private String srfparentdename;
	private String srfparenttype;

}
