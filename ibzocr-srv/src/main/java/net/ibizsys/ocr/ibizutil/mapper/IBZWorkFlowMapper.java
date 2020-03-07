package net.ibizsys.ocr.ibizutil.mapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import net.ibizsys.ocr.ibizutil.domain.Worklist;
import net.ibizsys.ocr.ibizutil.domain.WorklistSearchFilter;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import java.io.Serializable;
import java.util.List;
import java.util.Map;

public interface IBZWorkFlowMapper extends BaseMapper<Worklist> {
 @CacheEvict( value="entity",key = "'Worklist:'+#p0.worklistid")
    void updateOne(@Param("worklist") Worklist worklist);
    List<Worklist> searchMy(@Param("srf") WorklistSearchFilter searchfilter, @Param("ew") Wrapper<Worklist> wrapper) ;
    Page<Worklist> searchMy(IPage page, @Param("srf") WorklistSearchFilter searchfilter, @Param("ew") Wrapper<Worklist> wrapper) ;
    List<Worklist> searchDefault(@Param("srf") WorklistSearchFilter searchfilter, @Param("ew") Wrapper<Worklist> wrapper) ;
    Page<Worklist> searchDefault(IPage page, @Param("srf") WorklistSearchFilter searchfilter, @Param("ew") Wrapper<Worklist> wrapper) ;
    @Select("${sql}")
    List<Map<String,Object>> selectRow(@Param("sql")String sql);
    @Override
    @Cacheable( value="entity",key = "'Worklist:'+#p0")
    Worklist selectById(Serializable id);
    @Override
    @CacheEvict( value="entity",key = "'Worklist:'+#p0.worklistid")
    int updateById(@Param(Constants.ENTITY) Worklist entity);
    @Override
    @CacheEvict( value="entity",key = "'Worklist:'+#p0.worklistid")
    int insert(Worklist entity);
    @Override
    @CacheEvict( value="entity",key = "'Worklist:'+#p0")
    int deleteById(Serializable id);
}