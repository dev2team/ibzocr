package net.ibizsys.ocr.dto;

import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
public class OCRResult implements Serializable{
    private String ocrrecordid;
    private List<ImgItem> imgItems;
    private String content;
    private String procstate="waiting";

    private String title;
    public void setImgItems(List<ImgItem> imgItems) {

        for(ImgItem item:imgItems)
        {
            item.setBase64(null);
        }
        this.imgItems = imgItems;
    }
}
