package net.ibizsys.ocr.ocr.service.dto;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import net.ibizsys.ocr.ibizutil.domain.ParentData;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import org.springframework.util.StringUtils;
import lombok.Data;
import java.util.Map;
import java.sql.Timestamp;
import net.ibizsys.ocr.ibizutil.service.SearchFilterBase;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import net.ibizsys.ocr.ibizutil.domain.DataObj;
import net.ibizsys.ocr.ibizutil.domain.CodeListBase;
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OCRRecordSearchFilter extends SearchFilterBase {

	private String query;
	private Page page;
	private QueryWrapper<OCRRecord> selectCond;
	public OCRRecordSearchFilter(){
		this.page =new Page<OCRRecord>(1,Short.MAX_VALUE);
		this.selectCond=new QueryWrapper<OCRRecord>();	
	}
	/**
	 * 设定自定义查询条件，在原有SQL基础上追加该SQL
	 */
	public void setCustomCond(String sql)
	{
		this.selectCond.apply(sql);
	}
	/**
	 * 获取父数据
	 * @param srfparentdata
	 */
	public void setSrfparentdata(DataObj srfparentdata) {
		this.srfparentdata = srfparentdata;
		String strParentkey=this.getSrfparentdata().getStringValue("srfparentkey");
	}
	/**
	 * 启用快速搜索
	 */
	public void setQuery(String query)
	{
		 this.query=query;
		 if(!StringUtils.isEmpty(query)){
			this.selectCond.or().like("ocrrecordname",query);
		 }
	}
	/**
	 * 输出实体搜索项
	 */
	private String n_ocrrecordid_like;//[识别记录标识]
	public void setN_ocrrecordid_like(String n_ocrrecordid_like) {
        this.n_ocrrecordid_like = n_ocrrecordid_like;
        if(!StringUtils.isEmpty(this.n_ocrrecordid_like)){
            this.selectCond.like("ocrrecordid", n_ocrrecordid_like);
        }
    }
	private String n_ocrrecordname_like;//[识别记录名称]
	public void setN_ocrrecordname_like(String n_ocrrecordname_like) {
        this.n_ocrrecordname_like = n_ocrrecordname_like;
        if(!StringUtils.isEmpty(this.n_ocrrecordname_like)){
            this.selectCond.like("ocrrecordname", n_ocrrecordname_like);
        }
    }
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
	private Timestamp n_updatedate_gtandeq;//[更新时间]
	public void setN_updatedate_gtandeq(Timestamp n_updatedate_gtandeq) {
        this.n_updatedate_gtandeq = n_updatedate_gtandeq;
        if(!StringUtils.isEmpty(this.n_updatedate_gtandeq)){
            this.selectCond.ge("updatedate", n_updatedate_gtandeq);
        }
    }
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="GMT+8")
	private Timestamp n_updatedate_ltandeq;//[更新时间]
	public void setN_updatedate_ltandeq(Timestamp n_updatedate_ltandeq) {
        this.n_updatedate_ltandeq = n_updatedate_ltandeq;
        if(!StringUtils.isEmpty(this.n_updatedate_ltandeq)){
            this.selectCond.le("updatedate", n_updatedate_ltandeq);
        }
    }
	private String n_procstate_eq;//[处理状态]
	public void setN_procstate_eq(String n_procstate_eq) {
        this.n_procstate_eq = n_procstate_eq;
        if(!StringUtils.isEmpty(this.n_procstate_eq)){
            this.selectCond.eq("procstate", n_procstate_eq);
        }
    }

}
