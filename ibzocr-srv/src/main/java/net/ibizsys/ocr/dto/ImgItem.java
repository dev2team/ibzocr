package net.ibizsys.ocr.dto;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class ImgItem implements Serializable {
    private String img;
    @JSONField(serialize=false)
    private transient String base64;
    private List<TextBox> res=new ArrayList<TextBox>();
    private String content="";
    private Double timetake=-1d;
    private Integer width=0;
    private Integer height=0;
    private Integer ocrState=0;
    private String title;
}
