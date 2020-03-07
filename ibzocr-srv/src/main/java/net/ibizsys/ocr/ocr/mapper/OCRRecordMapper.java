package net.ibizsys.ocr.ocr.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import java.util.Map;
import org.apache.ibatis.annotations.Select;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.service.dto.OCRRecordSearchFilter;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import java.io.Serializable;
import com.baomidou.mybatisplus.core.toolkit.Constants;

public interface OCRRecordMapper extends BaseMapper<OCRRecord>{

    List<OCRRecord> searchDefault(@Param("srf") OCRRecordSearchFilter searchfilter,@Param("ew") Wrapper<OCRRecord> wrapper) ;
    Page<OCRRecord> searchDefault(IPage page, @Param("srf") OCRRecordSearchFilter searchfilter, @Param("ew") Wrapper<OCRRecord> wrapper) ;
    List<OCRRecord> searchMy(@Param("srf") OCRRecordSearchFilter searchfilter,@Param("ew") Wrapper<OCRRecord> wrapper) ;
    Page<OCRRecord> searchMy(IPage page, @Param("srf") OCRRecordSearchFilter searchfilter, @Param("ew") Wrapper<OCRRecord> wrapper) ;
    @Select("${sql}")
    List<Map<String,Object>> selectRow( @Param("sql")String sql);
    @Override
    OCRRecord selectById(Serializable id);
    @Override
    int insert(OCRRecord entity);
    @Override
    int updateById(@Param(Constants.ENTITY) OCRRecord entity);
    @Override
    int deleteById(Serializable id);
    Page<OCRRecord> selectPermission(IPage page,@Param("pw") Wrapper<OCRRecord> wrapper) ;
}