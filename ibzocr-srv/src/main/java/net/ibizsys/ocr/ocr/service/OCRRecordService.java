package net.ibizsys.ocr.ocr.service;

import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.service.dto.OCRRecordSearchFilter;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.Map;

/**
 * 实体[OCRRecord] 服务对象接口
 */
public interface OCRRecordService extends IService<OCRRecord>{

	boolean update(OCRRecord et);
	boolean getDraft(OCRRecord et);
	boolean remove(OCRRecord et);
	OCRRecord get(OCRRecord et);
	boolean checkKey(OCRRecord et);
	boolean create(OCRRecord et);
    List<OCRRecord> listDefault(OCRRecordSearchFilter filter) ;
	Page<OCRRecord> searchDefault(OCRRecordSearchFilter filter);
    List<OCRRecord> listMy(OCRRecordSearchFilter filter) ;
	Page<OCRRecord> searchMy(OCRRecordSearchFilter filter);
	/**	 实体[OCRRecord] 自定义数据查询  	**/
	List<Map<String,Object>> selectRow(String sql);
 }