package net.ibizsys.ocr.ibizutil.domain;

import java.io.Serializable;

/**
 * 
 *  系统代码表接口
 *
 */
public interface ICodeList {

	
	CodeList getCodeList();
    CodeList loadCodeList();
	void resetCodeList();
}
