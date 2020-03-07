package net.ibizsys.ocr.ibizutil.domain;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import lombok.Data;
import org.springframework.beans.BeanUtils;
import org.springframework.cglib.beans.BeanMap;
import org.springframework.cglib.beans.BeanGenerator;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.FieldFill;
import java.util.Map;
import java.util.HashMap;
import org.springframework.util.StringUtils;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import java.util.Date;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import java.util.UUID;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import org.springframework.cglib.beans.BeanCopier;
import net.ibizsys.ocr.ibizutil.domain.EntityBase;
import java.io.Serializable;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.math.BigInteger;
import net.ibizsys.ocr.ibizutil.enums.FillMode;
import net.ibizsys.ocr.ibizutil.enums.PredefinedType;
import net.ibizsys.ocr.ibizutil.annotation.PreField;
import com.alibaba.fastjson.annotation.JSONField;


/**
 * 实体[Worklist] 数据对象
 */
@TableName(value = "T_WORKLIST",resultMap = "WorklistResultMap")
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class Worklist extends EntityBase implements Serializable{

    @PreField(fill= FillMode.INSERT,preType = PredefinedType.CREATEMAN)
    private String createman;
    @TableId(value= "worklistid",type=IdType.UUID)//指定主键生成策略
    private String worklistid;
    @PreField(fill= FillMode.INSERT,preType = PredefinedType.CREATEDATE)
    private Timestamp createdate;
    private String worklistname;
    @PreField(fill= FillMode.INSERT_UPDATE,preType = PredefinedType.UPDATEDATE)
    private Timestamp updatedate;
    @PreField(fill= FillMode.INSERT_UPDATE,preType = PredefinedType.UPDATEMAN)
    private String updateman;
    private String userid;
    private String username;
    private String workflowid;
    private String workflowname;
    private String step;
    private String businesskey;
    private String startuserid;
    private String starttime;
    private String startusername;
    /**
     *  设置属性值[建立人]
     *  @param createman
     */
    public void setCreateman(String createman){
        if(StringUtils.isEmpty(createman))
            createman=null;
        this.createman = createman;
        this.set("createmandirtyflag",true);
    }
    /**
     *  获取属性值[建立人]
     */
    public String getCreateman(){
        return this.createman;
    }
    /**
     *  重置属性值[建立人]
     */
    public void resetCreateman(){
        this.set("createmandirtyflag",false);
        this.createman = null;
    }
    /**
     *  设置属性值[待办工作标识]
     *  @param worklistid
     */
    public void setWorklistid(String worklistid){
        if(StringUtils.isEmpty(worklistid))
            worklistid=null;
        this.worklistid = worklistid;
        this.set("worklistiddirtyflag",true);
    }
    /**
     *  获取属性值[待办工作标识]
     */
    public String getWorklistid(){
        return this.worklistid;
    }
    /**
     *  重置属性值[待办工作标识]
     */
    public void resetWorklistid(){
        this.set("worklistiddirtyflag",false);
        this.worklistid = null;
    }
    /**
     *  设置属性值[建立时间]
     *  @param createdate
     */
    public void setCreatedate(Timestamp createdate){
        this.createdate = createdate;
        this.set("createdatedirtyflag",true);
    }
    /**
     *  获取属性值[建立时间]
     */
    public Timestamp getCreatedate(){
        return this.createdate;
    }
    /**
     *  重置属性值[建立时间]
     */
    public void resetCreatedate(){
        this.set("createdatedirtyflag",false);
        this.createdate = null;
    }
    /**
     *  设置属性值[待办工作名称]
     *  @param worklistname
     */
    public void setWorklistname(String worklistname){
        if(StringUtils.isEmpty(worklistname))
            worklistname=null;
        this.worklistname = worklistname;
        this.set("worklistnamedirtyflag",true);
    }
    /**
     *  获取属性值[待办工作名称]
     */
    public String getWorklistname(){
        return this.worklistname;
    }
    /**
     *  重置属性值[待办工作名称]
     */
    public void resetWorklistname(){
        this.set("worklistnamedirtyflag",false);
        this.worklistname = null;
    }
    /**
     *  设置属性值[更新时间]
     *  @param updatedate
     */
    public void setUpdatedate(Timestamp updatedate){
        this.updatedate = updatedate;
        this.set("updatedatedirtyflag",true);
    }
    /**
     *  获取属性值[更新时间]
     */
    public Timestamp getUpdatedate(){
        return this.updatedate;
    }
    /**
     *  重置属性值[更新时间]
     */
    public void resetUpdatedate(){
        this.set("updatedatedirtyflag",false);
        this.updatedate = null;
    }
    /**
     *  设置属性值[更新人]
     *  @param updateman
     */
    public void setUpdateman(String updateman){
        if(StringUtils.isEmpty(updateman))
            updateman=null;
        this.updateman = updateman;
        this.set("updatemandirtyflag",true);
    }
    /**
     *  获取属性值[更新人]
     */
    public String getUpdateman(){
        return this.updateman;
    }
    /**
     *  重置属性值[更新人]
     */
    public void resetUpdateman(){
        this.set("updatemandirtyflag",false);
        this.updateman = null;
    }
    /**
     *  设置属性值[用户]
     *  @param userid
     */
    public void setUserid(String userid){
        if(StringUtils.isEmpty(userid))
            userid=null;
        this.userid = userid;
        this.set("useriddirtyflag",true);
    }
    /**
     *  获取属性值[用户]
     */
    public String getUserid(){
        return this.userid;
    }
    /**
     *  重置属性值[用户]
     */
    public void resetUserid(){
        this.set("useriddirtyflag",false);
        this.userid = null;
    }
    /**
     *  设置属性值[流程标识]
     *  @param workflowid
     */
    public void setWorkflowid(String workflowid){
        if(StringUtils.isEmpty(workflowid))
            workflowid=null;
        this.workflowid = workflowid;
        this.set("workflowiddirtyflag",true);
    }
    /**
     *  获取属性值[流程标识]
     */
    public String getWorkflowid(){
        return this.workflowid;
    }
    /**
     *  重置属性值[流程标识]
     */
    public void resetWorkflowid(){
        this.set("workflowiddirtyflag",false);
        this.workflowid = null;
    }
    /**
     *  设置属性值[流程]
     *  @param workflowname
     */
    public void setWorkflowname(String workflowname){
        if(StringUtils.isEmpty(workflowname))
            workflowname=null;
        this.workflowname = workflowname;
        this.set("workflownamedirtyflag",true);
    }
    /**
     *  获取属性值[流程]
     */
    public String getWorkflowname(){
        return this.workflowname;
    }
    /**
     *  重置属性值[流程]
     */
    public void resetWorkflowname(){
        this.set("workflownamedirtyflag",false);
        this.workflowname = null;
    }
    /**
     *  设置属性值[流程步骤]
     *  @param step
     */
    public void setStep(String step){
        if(StringUtils.isEmpty(step))
            step=null;
        this.step = step;
        this.set("stepdirtyflag",true);
    }
    /**
     *  获取属性值[流程步骤]
     */
    public String getStep(){
        return this.step;
    }
    /**
     *  重置属性值[流程步骤]
     */
    public void resetStep(){
        this.set("stepdirtyflag",false);
        this.step = null;
    }
    /**
     *  设置属性值[业务Key]
     *  @param businesskey
     */
    public void setBusinesskey(String businesskey){
        if(StringUtils.isEmpty(businesskey))
            businesskey=null;
        this.businesskey = businesskey;
        this.set("businesskeydirtyflag",true);
    }
    /**
     *  获取属性值[业务Key]
     */
    public String getBusinesskey(){
        return this.businesskey;
    }
    /**
     *  重置属性值[业务Key]
     */
    public void resetBusinesskey(){
        this.set("businesskeydirtyflag",false);
        this.businesskey = null;
    }
    /**
     *  设置属性值[发起人]
     *  @param startuserid
     */
    public void setStartuserid(String startuserid){
        if(StringUtils.isEmpty(startuserid))
            startuserid=null;
        this.startuserid = startuserid;
        this.set("startuseriddirtyflag",true);
    }
    /**
     *  获取属性值[发起人]
     */
    public String getStartuserid(){
        return this.startuserid;
    }
    /**
     *  重置属性值[发起人]
     */
    public void resetStartuserid(){
        this.set("startuseriddirtyflag",false);
        this.startuserid = null;
    }
    /**
     *  设置属性值[发起时间]
     *  @param starttime
     */
    public void setStarttime(String starttime){
        if(StringUtils.isEmpty(starttime))
            starttime=null;
        this.starttime = starttime;
        this.set("starttimedirtyflag",true);
    }
    /**
     *  获取属性值[发起时间]
     */
    public String getStarttime(){
        return this.starttime;
    }
    /**
     *  重置属性值[发起时间]
     */
    public void resetStarttime(){
        this.set("starttimedirtyflag",false);
        this.starttime = null;
    }

        /**
     *  设置属性值[发起人名称]
     *  @param startusername
     */
    public void setStartusername(String startusername){
        if(StringUtils.isEmpty(startusername))
            startusername=null;
        this.startusername = startusername;
        this.set("startusernamedirtyflag",true);
    }
    /**
     *  获取属性值[发起人名称]
     */
    public String getStartusername(){
        return this.startusername;
    }
    /**
     *  重置属性值[发起人名称]
     */
    public void resetStartusername(){
        this.set("startusernamedirtyflag",false);
        this.startusername = null;
    }

    /**
     * 重置当前数据对象属性值
     */
    public  void reset(){
        resetCreateman();
        resetWorklistid();
        resetCreatedate();
        resetWorklistname();
        resetUpdatedate();
        resetUpdateman();
        resetUserid();
        resetWorkflowid();
        resetWorkflowname();
        resetStep();
        resetBusinesskey();
        resetStartuserid();
        resetStarttime();
        resetStartusername();
    }
     /**
     * 获取数据主键（普通主键与联合主键）
     * @return
     */
    @JsonIgnore
    public Serializable getDefaultPrimaryKey()
    {
	    //随机生成主键
         return  IdWorker.get32UUID();

    }
     /**
     * 复制当前对象数据到目标对象(粘贴重置)
     *
     * @throws Exception
     */
    public Worklist copyTo(Worklist targetEntity)
	{
		BeanCopier copier=BeanCopier.create(Worklist.class, Worklist.class, false);
		copier.copy(this, targetEntity, null);
        targetEntity.resetWorklistid();
		return targetEntity;
	}
}