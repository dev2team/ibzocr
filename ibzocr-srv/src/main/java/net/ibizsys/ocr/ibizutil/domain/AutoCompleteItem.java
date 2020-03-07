package net.ibizsys.ocr.ibizutil.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;

/**
 * 自动填充数据项
 * @author ibizsys
 *
 */
@Data
@JsonInclude(Include.NON_NULL)
public class AutoCompleteItem {
	private String text = null;
	private String value = null;
	private String realtext = null;
	private String userdata = null;
	private String userdata2 = null;
	private String userdata3 = null;
	private String userdata4 = null;
}
