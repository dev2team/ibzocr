package net.ibizsys.ocr.ibizutil.vo;

import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.util.StringUtils;
import net.ibizsys.ocr.ibizutil.domain.Worklist;
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

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Worklist_EditForm_Main{

    @JsonProperty(access=Access.WRITE_ONLY)
    private Map<String,String> srfparentdata;
    @JsonIgnore
    private Timestamp updatedate;
    @JsonProperty(access=Access.WRITE_ONLY)
    private String srforikey;
    @JsonIgnore
    private String worklistid;
    @JsonIgnore
    private String worklistname;
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

    @JsonProperty(value = "srforikey")
    public String getSrforikey(){
        return srforikey;
    }
    @JsonProperty(value = "srforikey")
    public void setSrforikey(String srforikey){
        this.srforikey = srforikey;
    }

    @Size(min = 0, max = 100, message = "[待办工作标识]长度必须在[100]以内!")
    @JsonProperty(value = "srfkey")
    public String getSrfkey(){
        return worklistid;
    }
    @JsonProperty(value = "srfkey")
    public void setSrfkey(String worklistid){
        this.worklistid = worklistid;
    }

    @Size(min = 0, max = 200, message = "[待办工作名称]长度必须在[200]以内!")
    @JsonProperty(value = "srfmajortext")
    public String getSrfmajortext(){
        return worklistname;
    }

    @JsonProperty(value = "srftempmode")
    public String getSrftempmode(){
        return srftempmode;
    }
    @JsonProperty(value = "srftempmode")
    public void setSrftempmode(String srftempmode){
        this.srftempmode = srftempmode;
    }

    @JsonProperty(value = "srfdeid")
    public String getSrfdeid(){
        return srfdeid;
    }
    @JsonProperty(value = "srfdeid")
    public void setSrfdeid(String srfdeid){
        this.srfdeid = srfdeid;
    }

    @Size(min = 0, max = 200, message = "[待办工作名称]长度必须在[200]以内!")
    @JsonProperty(value = "worklistname")
    public String getWorklistname(){
        return worklistname;
    }
    @JsonProperty(value = "worklistname")
    public void setWorklistname(String worklistname){
        this.worklistname = worklistname;
    }

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

    @Size(min = 0, max = 100, message = "[待办工作标识]长度必须在[100]以内!")
    @JsonProperty(value = "worklistid")
    public String getWorklistid(){
        return worklistid;
    }
    @JsonProperty(value = "worklistid")
    public void setWorklistid(String worklistid){
        this.worklistid = worklistid;
    }

    public  void fromWorklist(Worklist sourceEntity)  {
        this.fromWorklist(sourceEntity,true);
    }

     /**
	 * do转换为vo
	 * @param sourceEntity do数据对象
	 * @return
	 */
    public  void fromWorklist(Worklist sourceEntity,boolean reset)  {
      BeanCopier copier=BeanCopier.create(Worklist.class, Worklist_EditForm_Main.class, false);
      copier.copy(sourceEntity,this,  null);
      this.toString();
	}

    /**
	 * vo转换为do
	 * @param
	 * @return
	 */
    public  Worklist toWorklist()  {
        Worklist targetEntity =new Worklist();
        BeanCopier copier=BeanCopier.create(Worklist_EditForm_Main.class, Worklist.class, false);
        copier.copy(this, targetEntity, null);
        return targetEntity;
	}

     /**
	 * 新建
	 * @param
	 * @return
	 */
    private boolean isCreate()
    {
    	if((StringUtils.isEmpty(this.srfuf))||this.srfuf.equals("0"))
	    	return true;
    	else
    	    return false;
    }
     /**
	 * 更新
	 * @param
	 * @return
	 */
    private boolean isUpdate()
    {
    	if((!StringUtils.isEmpty(this.srfuf))&&this.srfuf.equals("1"))
	    	return true;
    	else
    	    return false;
    }

}
