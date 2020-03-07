package net.ibizsys.ocr.ibizutil.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;

@Data
@JsonInclude(Include.NON_NULL)
public class TreeNode {
	private String id = null;
	private String text = null;
	private String tips = null;
	private String icon = null;
	private String iconcls = null;
	private boolean expanded = false;
	private boolean disable = false;
	private boolean leaf = true;
	private String nodetype = null;
	private String datatype = null;
	private boolean checked = false;
	private boolean enablecheck = false;
	private boolean asyncmode = true;
	private String srfkey = null;
	private String srfmajortext = null;
	private String userdata = null;
	private String userdata2 = null;
	private String userdata3 = null;
	private String userdata4 = null;
}
