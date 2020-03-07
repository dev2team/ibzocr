package net.ibizsys.ocr.ocr.vo;

import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import net.ibizsys.ocr.ocr.service.dto.OCRRecordSearchFilter;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.util.StringUtils;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OCRRecord_SearchForm_Default{

    private Map<String,String> srfparentdata;

    private String n_ocrrecordid_like;
    private String n_ocrrecordname_like;
    private String n_procstate_eq;
    private Timestamp n_updatedate_gtandeq;
    private Timestamp n_updatedate_ltandeq;
    private Page page;
    private Page getPage(){
        if(this.page==null)
            this.page=new Page(1,20,true);
        return this.page;
    }
    public  void fromOCRRecordSearchFilter(OCRRecordSearchFilter sourceSearchFilter)  {
        this.setN_ocrrecordid_like(sourceSearchFilter.getN_ocrrecordid_like());
        this.setN_ocrrecordname_like(sourceSearchFilter.getN_ocrrecordname_like());
        this.setN_procstate_eq(sourceSearchFilter.getN_procstate_eq());
        this.setN_updatedate_gtandeq(sourceSearchFilter.getN_updatedate_gtandeq());
        this.setN_updatedate_ltandeq(sourceSearchFilter.getN_updatedate_ltandeq());
        this.setPage(sourceSearchFilter.getPage());
	}
    public  OCRRecordSearchFilter toOCRRecordSearchFilter()  {
        OCRRecordSearchFilter targetSearchFilter=new OCRRecordSearchFilter();
        if(targetSearchFilter.getN_ocrrecordid_like()==null)
            targetSearchFilter.setN_ocrrecordid_like(this.getN_ocrrecordid_like());
        if(targetSearchFilter.getN_ocrrecordname_like()==null)
            targetSearchFilter.setN_ocrrecordname_like(this.getN_ocrrecordname_like());
        if(targetSearchFilter.getN_procstate_eq()==null)
            targetSearchFilter.setN_procstate_eq(this.getN_procstate_eq());
        if(targetSearchFilter.getN_updatedate_gtandeq()==null)
            targetSearchFilter.setN_updatedate_gtandeq(this.getN_updatedate_gtandeq());
        if(targetSearchFilter.getN_updatedate_ltandeq()==null)
            targetSearchFilter.setN_updatedate_ltandeq(this.getN_updatedate_ltandeq());
        targetSearchFilter.setPage(this.getPage());
        return targetSearchFilter;
	}

}