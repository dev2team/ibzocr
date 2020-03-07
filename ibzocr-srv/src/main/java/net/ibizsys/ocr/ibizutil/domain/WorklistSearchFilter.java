package net.ibizsys.ocr.ibizutil.domain;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import net.ibizsys.ocr.ibizutil.domain.Worklist;
import org.springframework.util.StringUtils;
import lombok.Data;
import java.util.Map;
import java.sql.Timestamp;
import net.ibizsys.ocr.ibizutil.service.SearchFilterBase;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.alibaba.fastjson.JSONObject;
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorklistSearchFilter extends SearchFilterBase {

	private String query;
	private Page page;
	private QueryWrapper<Worklist> selectCond;
	private JSONObject customsearchval;
	public WorklistSearchFilter(){
		this.page =new Page<Worklist>(1,Short.MAX_VALUE);
		this.selectCond=new QueryWrapper<Worklist>();	
	}

	/**
	 * 设定自定义查询条件，在原有SQL基础上追加该SQL
	 */
	public void setCustomCond(String sql)
	{
		this.selectCond.apply(sql);
	}

	private String n_worklistname_like;

	public void setN_worklistname_like(String n_worklistname_like) {
        this.n_worklistname_like = n_worklistname_like;
        if(!StringUtils.isEmpty(this.n_worklistname_like)){
            this.selectCond.like("worklistname", n_worklistname_like);
        }
    }

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
			this.selectCond.or().like("worklistname",query);
		 }
	}

}