package net.ibizsys.ocr.ibizutil.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;
import java.util.HashMap;

/**
 * 代码表数据对象
 * @author ibizsys
 *
 */
@Data
@JsonInclude(Include.NON_NULL)
@NoArgsConstructor
public class CodeList {
	private String srfkey = null;
	private String srfmajortext = null;
	private String userdata = null;
	private String userdata2 = null;
	private String userdata3 = null;
	private String userdata4 = null;
	private CodeItem[] items = null;
	private String valueseparator=";";
	private String textseparator=";";
	private String emptytext=";";
	private String ormode="";

	@JsonIgnore
	private HashMap<String,CodeItem> codeItemModelMap=new HashMap<String, CodeItem>();


	public String getCodeListText(String strValue,boolean ignocatch) {
		try
		{
			return getCodeListText(strValue);
		}
		catch (Exception ex){
			return "";
		}
	}

	public String getCodeListText(String strValue) throws Exception {
		if (StringUtils.isEmpty(strValue)) return this.getEmptytext();
		if (this.getOrmode().equals("STR")) {
			String strTotalText = "";
			String[] values = StringUtils.split(strValue, this.getValueseparator());
			for (String strItem : values) {
				CodeItem iCodeItem = this.getCodeItemModelMap().get(strItem);
				if (iCodeItem == null) throw new Exception(String.format("无法获取值[%1$s]对应的文本信息", strItem));
				if (!StringUtils.isEmpty(strTotalText)) {
					strTotalText += this.getTextseparator();
				}
				strTotalText += iCodeItem.getText();
			}
			return strTotalText;
		}
		if (this.getOrmode().equals("NUM")) {
			// 数值
			String strTotalText = "";
			int nValue = Integer.parseInt(strValue);
			if (nValue == 0) {
				return this.getEmptytext();
			}
			for(CodeItem iCodeItem:this.getItems() ) {
				int nValueItem = Integer.parseInt(iCodeItem.getValue().toString());
				if ((nValue & nValueItem) == nValueItem) {
					if (!StringUtils.isEmpty(strTotalText)) {
						strTotalText += this.getTextseparator();
					}
					strTotalText += iCodeItem.getText();
				}
			}
			return strTotalText;
		}
		CodeItem iCodeItem = this.getCodeItemModelMap().get(strValue);
		if (iCodeItem != null) return iCodeItem.getText();
		throw new Exception(String.format("无法获取值[%1$s]对应的文本信息", strValue));
	}
}
