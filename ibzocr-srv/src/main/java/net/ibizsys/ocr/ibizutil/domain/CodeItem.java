package net.ibizsys.ocr.ibizutil.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
/**
 * 代码项数据对象
 * @author ibizsys
 *
 */
@Data
@NoArgsConstructor
@JsonInclude(Include.NON_NULL)
public class CodeItem {
	private Object value = null;
	private String id = null;
	private String text = null;
	private String label = null;
	private String parentValue = null;
	private String color = null;
	private String iconpath = null;
	private String iconpathx = null;
	private String iconcls = null;
	private String iconclsx = null;
	private String textcls = null;
	private boolean disabled;
	private String textlanrestag = null;
	private String userdata = null;
	private String userdata2 = null;
	private String userdata3 = null;
	private String userdata4 = null;
	private String fillter = null;
	private CodeItem[] items = null;
	private List<CodeItem> children;
    }
