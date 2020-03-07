package net.ibizsys.ocr.dto;

import lombok.Data;

@Data
public class TextLine {
    private String text;
    private Double cx;
    private Double cy;
    private Float w;
    private Float h;
    private Float degree;
}
