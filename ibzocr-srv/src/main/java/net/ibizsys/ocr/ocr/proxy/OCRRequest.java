package net.ibizsys.ocr.ocr.proxy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)

@Data
public class OCRRequest implements Serializable {

    private String id;
    private Integer detectangle=1;
    private Integer removered=0;
    private int resize=1;

    private int autoRotate=1;
    private List<Item> pathlist=new ArrayList<>();

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    class Item implements Serializable
    {
        private String imgString;
        private String name;
        private String path;
        private String weburl;
        private long size;
    }

    public String getId()
    {
        if(StringUtils.isEmpty(id))
        {
            String str=pathlist.toString()+detectangle+removered+resize;
            id= DigestUtils.md5DigestAsHex(str.getBytes());
        }
        return id;
    }

    public void addItem(String name,String path,String weburl,String base64)
    {
        Item item=new Item();
        item.setImgString(base64);
        item.setName(name);
        item.setPath(path);
        item.setWeburl(weburl);
        pathlist.add(item);
    }

    public void addPath(String path)
    {
        Item item=new Item();
        item.setPath(path);
        item.setSize((new File(path)).length());
        pathlist.add(item);
    }

    public void addUrl(String filename,String weburl)
    {
        Item item=new Item();
        item.setName(filename);
        item.setWeburl(weburl);
        item.setSize(weburl.length());
        pathlist.add(item);
    }

    public void addBase64(String filename,String base64)
    {
        Item item=new Item();
        item.setName(filename);
        item.setImgString(base64);
        item.setSize(base64.length());
        pathlist.add(item);
    }

    public OCRRequest(String path)
    {
        this.addPath(path);
    }

    public OCRRequest(String filename,String content)
    {
        if(content.startsWith("http"))
            this.addUrl(filename,content);
        else
            this.addBase64(filename,content);
    }

}
