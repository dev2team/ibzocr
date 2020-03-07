package net.ibizsys.ocr.ocr.service.impl;

import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import net.ibizsys.ocr.ocr.mapper.OCRRecordMapper;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.service.OCRRecordService;
import net.ibizsys.ocr.ibizutil.service.ServiceImplBase;
import net.ibizsys.ocr.ocr.service.dto.OCRRecordSearchFilter;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import java.util.UUID;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.math.BigInteger;
import net.ibizsys.ocr.ibizutil.annotation.PreField;
import java.lang.reflect.Field;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;


/**
 * 实体[OCRRecord] 服务对象接口实现
 */
@Service
public class OCRRecordServiceImpl extends ServiceImplBase<OCRRecordMapper, OCRRecord> implements OCRRecordService{

    @Resource
    private OCRRecordMapper ocrrecordMapper;

    @Override
    public boolean create(OCRRecord et) {
        this.beforeCreate(et);
         return super.create(et);
    }
    @Override
    public boolean update(OCRRecord et){
        this.beforeUpdate(et);
		this.ocrrecordMapper.updateById(et);
		this.get(et);
		return true;
    }
    public Object getEntityKey(OCRRecord et){
		return et.getOcrrecordid();  
    }
    @Override
    public boolean getDraft(OCRRecord et)  {
            return true;
    }
	public List<OCRRecord> listDefault(OCRRecordSearchFilter filter) {
		return ocrrecordMapper.searchDefault(filter,filter.getSelectCond());
	}
	public Page<OCRRecord> searchDefault(OCRRecordSearchFilter filter) {
		return ocrrecordMapper.searchDefault(filter.getPage(),filter,filter.getSelectCond());
	}
	public List<OCRRecord> listMy(OCRRecordSearchFilter filter) {
		return ocrrecordMapper.searchMy(filter,filter.getSelectCond());
	}
	public Page<OCRRecord> searchMy(OCRRecordSearchFilter filter) {
		return ocrrecordMapper.searchMy(filter.getPage(),filter,filter.getSelectCond());
	}
    public  List<Map<String,Object>> selectRow(String sql){
       return ocrrecordMapper.selectRow(sql);
    }
    @Override
    public Page<OCRRecord> selectPermission(QueryWrapper<OCRRecord> selectCond) {
        return ocrrecordMapper.selectPermission(new OCRRecordSearchFilter().getPage(),selectCond);
    }
 }