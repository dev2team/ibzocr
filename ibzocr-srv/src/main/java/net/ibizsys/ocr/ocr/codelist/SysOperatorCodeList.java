package net.ibizsys.ocr.ocr.codelist;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import org.springframework.util.StringUtils;
import org.springframework.stereotype.Component;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import net.ibizsys.ocr.ibizutil.domain.CodeList;
import net.ibizsys.ocr.ibizutil.domain.CodeItem;

/**
 * 代码表[云系统操作者]
 */
@Component("ibzocr_SysOperatorCodeList")
public class SysOperatorCodeList extends net.ibizsys.ocr.ibizutil.domain.CodeListBase{

	private String valueseparator=";";
	private String textseparator=";";
	private String emptytext="未定义";
	private String ormode="";

    @PostConstruct
	protected void init()
	{
	}
	@Override
	public void initCodeList()  {
		CodeList codeList = new CodeList();
		codeList.setSrfkey("ibzocr_SysOperator");
		List<CodeItem> codeItemList = new ArrayList<CodeItem>();
		codeList.setValueseparator(valueseparator);
		codeList.setTextseparator(textseparator);
		codeList.setEmptytext(emptytext);
		codeList.setOrmode(ormode);
        this.setCodeList(codeList);
    }
}