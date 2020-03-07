package net.ibizsys.ocr.ocr.domain;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import net.ibizsys.ocr.dto.ImgItem;
import net.ibizsys.ocr.ocr.proxy.OCRResponse;
import org.springframework.cglib.beans.BeanCopier;
import org.springframework.util.StringUtils;

import lombok.Data;
import net.ibizsys.ocr.ibizutil.annotation.PreField;
import net.ibizsys.ocr.ibizutil.domain.EntityBase;
import net.ibizsys.ocr.ibizutil.enums.FillMode;
import net.ibizsys.ocr.ibizutil.enums.PredefinedType;


/**
 * 实体[OCRRecord] 数据对象
 */
@TableName(value = "T_OCRRECORD",resultMap = "OCRRecordResultMap")
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OCRRecord extends EntityBase implements Serializable{


    @TableId(value= "ocrrecordid",type=IdType.UUID)//指定主键生成策略
    private String ocrrecordid;
    private String ocrrecordname;
    @JsonIgnore
    private String filelist="[]";
    private String procstate;
    @PreField(fill= FillMode.INSERT,preType = PredefinedType.CREATEDATE)
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    private Timestamp createdate;
    @PreField(fill= FillMode.INSERT,preType = PredefinedType.CREATEMAN)
    private String createman;
    @PreField(fill= FillMode.INSERT_UPDATE,preType = PredefinedType.UPDATEDATE)
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    private Timestamp updatedate;
    @PreField(fill= FillMode.INSERT_UPDATE,preType = PredefinedType.UPDATEMAN)
    private String updateman;
    @TableField(exist = false)
    private List<ImgItem> imgItems;

    @TableField(exist = false)
    private String content;

    public List<ImgItem> getImgItems() {
        if(imgItems==null)
        {
            if(!StringUtils.isEmpty(this.filelist))
            {
                imgItems= JSONArray.parseArray(filelist,ImgItem.class);
            }
        }
        return imgItems;
    }

    public void setImgItems(List<ImgItem> imgItems) {
        this.imgItems = imgItems;
        if(imgItems!=null)
            this.filelist= JSON.toJSONString(this.imgItems);
    }

    public void putImgItem(ImgItem imgItem) {
        boolean bAdd=true;
        for(ImgItem item:this.getImgItems())
        {
            if(item.getImg().equals(imgItem.getImg()))
            {
                item.setRes(imgItem.getRes());
                item.setContent(imgItem.getContent());
                item.setTitle(imgItem.getTitle());
                item.setTimetake(imgItem.getTimetake());
                if(imgItem.getWidth()!=0)
                    item.setWidth(imgItem.getWidth());
                else
                    imgItem.setWidth(item.getWidth());
                if(imgItem.getHeight()!=0)
                    item.setHeight(imgItem.getHeight());
                else
                    imgItem.setHeight(item.getHeight());
                item.setOcrState(imgItem.getOcrState());
                bAdd=false;
            }
        }
        if(bAdd)
            this.getImgItems().add(imgItem);

        this.filelist= JSON.toJSONString(this.imgItems);
    }

    public String getContent()
    {
        String text="";
        for(ImgItem item:this.getImgItems())
        {
            text+=item.getContent();
        }
        this.content=text;
        return this.content;
    }


    public String getProcstate()
    {
        if(StringUtils.isEmpty(this.procstate)||this.procstate.equals("waiting")) {
            for(ImgItem item:this.getImgItems()) {

                if(item.getOcrState().equals(0)) {
                    this.procstate="waiting";
                    break;
                }
                else if(item.getOcrState().equals(-1)) {
                    this.procstate="error";
                    break;
                }
                else if(item.getOcrState().equals(1)) {
                    this.procstate="succ";
                }
            }
            if(StringUtils.isEmpty(this.procstate))
                this.procstate="waiting";
        }
        return this.procstate;
    }


    public String getOcrrecordname()
    {

        if(getImgItems()!=null)
        {

            if(imgItems.size()>0)
            {
                for(ImgItem item:imgItems)
                {
                    if((!StringUtils.isEmpty(item.getTitle())))
                    {
                        ocrrecordname = item.getTitle();
                        break;
                    }
                }

            }
        }

        return ocrrecordname;
    }

    /**
     * 复制当前对象数据到目标对象(粘贴重置)
     *
     * @throws Exception
     */
    public OCRRecord copyTo(OCRRecord targetEntity)
	{
		BeanCopier copier=BeanCopier.create(OCRRecord.class, OCRRecord.class, false);
		copier.copy(this, targetEntity, null);
        targetEntity.setOcrrecordid(null);
		return targetEntity;
	}
}
