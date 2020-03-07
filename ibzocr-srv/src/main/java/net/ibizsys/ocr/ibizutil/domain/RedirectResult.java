package net.ibizsys.ocr.ibizutil.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;

@Data
@JsonInclude(Include.NON_NULL)
public class RedirectResult<T> {
    private String viewmodule;
    private String viewtag;
    private String viewname;
    private String title;
    private String openmode;
    private String width;
    private String height;
    private T viewparams;
    private String url;
}
