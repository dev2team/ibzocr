package net.ibizsys.ocr.ocr.vo;

import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.util.StringUtils;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;
import java.util.Date;
import org.springframework.cglib.beans.BeanCopier;
import javax.validation.constraints.Size;
import java.util.UUID;
import org.springframework.cglib.beans.BeanCopier;
import com.fasterxml.jackson.annotation.JsonIgnore;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import java.math.BigInteger;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import java.util.HashSet;
import java.util.Set;
import net.ibizsys.ocr.ibizutil.domain.VOBase;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OCRRecord_EditForm_Main{

    @JsonProperty(access=Access.WRITE_ONLY)
    private Map<String,String> srfparentdata;
    @JsonIgnore
    private Timestamp updatedate;
    @JsonProperty(access=Access.WRITE_ONLY)
    private String srforikey;
    @JsonIgnore
    private String ocrrecordid;
    @JsonIgnore
    private String ocrrecordname;
    @JsonIgnore
    private String srftempmode;
    @JsonProperty
    private String srfuf;
    @JsonProperty
    private String srfdeid;
    @JsonProperty(access=Access.WRITE_ONLY)
    private String srfsourcekey;
    @JsonIgnore
    private String createman;
    @JsonIgnore
    private Timestamp createdate;
    @JsonIgnore
    private String updateman;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    @JsonProperty(value = "srfupdatedate")
    public Timestamp getSrfupdatedate(){
        return updatedate;
    }
    @JsonProperty(value = "srfupdatedate")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    public void setSrfupdatedate(Timestamp updatedate){
        this.updatedate = updatedate;
    }
    @Size(min = 0, max = 100, message = "[识别记录标识]长度必须在[100]以内!")
    @JsonProperty(value = "srfkey")
    public String getSrfkey(){
        return ocrrecordid;
    }
    @JsonProperty(value = "srfkey")
    public void setSrfkey(String ocrrecordid){
        this.ocrrecordid = ocrrecordid;
    }
    @Size(min = 0, max = 200, message = "[识别记录名称]长度必须在[200]以内!")
    @JsonProperty(value = "srfmajortext")
    public String getSrfmajortext(){
        return ocrrecordname;
    }
    @Size(min = 0, max = 200, message = "[识别记录名称]长度必须在[200]以内!")
    @JsonProperty(value = "ocrrecordname")
    public String getOcrrecordname(){
        return ocrrecordname;
    }
    @JsonProperty(value = "ocrrecordname")
    public void setOcrrecordname(String ocrrecordname){
        this.ocrrecordname = ocrrecordname;
    }
    @Size(min = 0, max = 60, message = "[建立人]长度必须在[60]以内!")
    @JsonProperty(value = "createman")
    public String getCreateman(){
        return createman;
    }
    @JsonProperty(value = "createman")
    public void setCreateman(String createman){
        this.createman = createman;
    }
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    @JsonProperty(value = "createdate")
    public Timestamp getCreatedate(){
        return createdate;
    }
    @JsonProperty(value = "createdate")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    public void setCreatedate(Timestamp createdate){
        this.createdate = createdate;
    }
    @Size(min = 0, max = 60, message = "[更新人]长度必须在[60]以内!")
    @JsonProperty(value = "updateman")
    public String getUpdateman(){
        return updateman;
    }
    @JsonProperty(value = "updateman")
    public void setUpdateman(String updateman){
        this.updateman = updateman;
    }
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    @JsonProperty(value = "updatedate")
    public Timestamp getUpdatedate(){
        return updatedate;
    }
    @JsonProperty(value = "updatedate")
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    public void setUpdatedate(Timestamp updatedate){
        this.updatedate = updatedate;
    }
    @Size(min = 0, max = 100, message = "[识别记录标识]长度必须在[100]以内!")
    @JsonProperty(value = "ocrrecordid")
    public String getOcrrecordid(){
        return ocrrecordid;
    }
    @JsonProperty(value = "ocrrecordid")
    public void setOcrrecordid(String ocrrecordid){
        this.ocrrecordid = ocrrecordid;
    }
    public  void fromOCRRecord(OCRRecord sourceEntity)  {
        this.fromOCRRecord(sourceEntity,true);
    }
     /**
	 * do转换为vo
	 * @param sourceEntity do数据对象
	 * @return
	 */
    public  void fromOCRRecord(OCRRecord sourceEntity,boolean reset)  {
      BeanCopier copier=BeanCopier.create(OCRRecord.class, OCRRecord_EditForm_Main.class, false);
      copier.copy(sourceEntity,this,  null);
      this.toString();
	}
    /**
	 * vo转换为do
	 * @param
	 * @return
	 */
    public  OCRRecord toOCRRecord()  {
        OCRRecord targetEntity =new OCRRecord();
        BeanCopier copier=BeanCopier.create(OCRRecord_EditForm_Main.class, OCRRecord.class, false);
        copier.copy(this, targetEntity, null);
        return targetEntity;
	}
}
