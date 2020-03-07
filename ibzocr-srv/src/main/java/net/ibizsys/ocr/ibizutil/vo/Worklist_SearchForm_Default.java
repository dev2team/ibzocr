package net.ibizsys.ocr.ibizutil.vo;

import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import net.ibizsys.ocr.ibizutil.domain.WorklistSearchFilter;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.util.StringUtils;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Worklist_SearchForm_Default{

    private Map<String,String> srfparentdata;

    private Page page;
    private Page getPage(){
        if(this.page==null)
            this.page=new Page(1,20,true);
        return this.page;
    }

    public  void fromWorklistSearchFilter(WorklistSearchFilter sourceSearchFilter)  {
        this.setPage(sourceSearchFilter.getPage());
	}
    public  WorklistSearchFilter toWorklistSearchFilter()  {
        WorklistSearchFilter targetSearchFilter=new WorklistSearchFilter();
        targetSearchFilter.setPage(this.getPage());
        return targetSearchFilter;
	}


}
