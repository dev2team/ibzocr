package net.ibizsys.ocr.ibizutil.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import lombok.Data;

@Data
@JsonInclude(Include.NON_NULL)
public class TreeNodeFilter {
	private String realNodeId = null;
	private boolean autoExpand = false;
	private String nodeType = null;
	private String srfParentKey = null;
	private String srfCat = null;
	private String srfNodeFilter = null;
	private String srfNodeId = null;
	private String nodeId = null;
	private String nodeId2 = null;
	private String nodeId3 = null;
	private String nodeId4 = null;
	private String nodeId5 = null;
	private String nodeId6 = null;
}
