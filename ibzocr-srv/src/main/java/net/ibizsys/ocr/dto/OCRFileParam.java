package net.ibizsys.ocr.dto;

import lombok.Data;
import net.ibizsys.ocr.ocr.domain.OCRRecord;

import java.util.List;

@Data
public class OCRFileParam {
    private String filePath;
    private String fileid;
    private OCRRecord ocrRecord;
    private List<ImgItem> imgItems;
}
