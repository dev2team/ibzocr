package net.ibizsys.ocr.ibizutil.domain;

import net.ibizsys.ocr.ibizutil.SpringContextHolder;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;
/**
 * 
 *   代码表对象基类
 *
 */
public abstract class CodeListBase implements ICodeList {
	
	private CodeList codeList = null;

	/**
	 *   获取代码表对象
	 */
	@Override
	public CodeList getCodeList() {
		if(this.codeList==null)
		{
			ICodeList list=(ICodeList) SpringContextHolder.getBean(this.getClass());
			if(list!=null)
			{
				this.codeList=list.loadCodeList();
			}
		}
		return this.codeList;
	}

	@Override
	@Cacheable( value="ibzocr_codelist",key = "'cl:'+#root.targetClass")
	public CodeList loadCodeList() {
		this.initCodeList();
		return this.codeList;
	}

	@Override
	@CacheEvict( value="ibzocr_codelist",key = "'cl:'+#root.targetClass")
	public void resetCodeList()
	{
		this.codeList=null;
	}

	protected void setCodeList(CodeList codeList){
		this.codeList = codeList;
	}

    public void initCodeList()
	{

	}
    /**
	 * 递归创建树结构数据
	 * @param listCodeItem
	 * @param parentValue
	 * @return
	 */
	public List<CodeItem> getTrees(List<CodeItem> listCodeItem, Object parentValue) {
		List<CodeItem> trees = new ArrayList<CodeItem>();
		for (CodeItem codeItem : listCodeItem) {
			String codeItemParentValue = codeItem.getParentValue();
			if (StringUtils.isEmpty(codeItemParentValue)) {
				codeItemParentValue = "";
			}
			if (parentValue.equals(codeItemParentValue)) {
				List<CodeItem> childCodeItem = getTrees(listCodeItem, codeItem.getValue());
				if (childCodeItem.size() > 0) {
					codeItem.setChildren(childCodeItem);
				}
				trees.add(codeItem);
			}
		}
		return trees;
	}

	public static String getCodeListText(String codeListName,String value) {
		try {
			CodeList codelist= ((ICodeList)SpringContextHolder.getBean(codeListName)).getCodeList();
			return codelist.getCodeListText(value);
		}
		catch (Exception e) {
			return "";
		}
	}

	public static ICodeList getCodeList(String codeListName) {
		try {
			return ((ICodeList)SpringContextHolder.getBean(codeListName));
		}
		catch (Exception e) {
			return null;
		}
	}
}
