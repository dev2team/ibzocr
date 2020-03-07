package net.ibizsys.ocr.dto;

import lombok.Data;
import java.io.Serializable;
import java.util.List;

@Data
public class TextBox implements Serializable {
    private String name;
    private String text;
    private List<Integer> box;
}
