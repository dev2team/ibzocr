package net.ibizsys.ocr.ibizutil.domain;

import java.sql.Timestamp;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.FieldFill;
import lombok.Data;
import org.springframework.util.ObjectUtils;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Date;

/**
 * 实体[IBZFILE] 数据对象
 */
@TableName(value = "IBZFILE")
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class IBZFILE implements Serializable{

    @Size(min = 0, max = 100, message = "[文件标识]长度必须在[100]以内!")
    @TableId(value= "fileid",type=IdType.INPUT)//指定主键生成策略
    private String fileid;

    @Size(min = 0, max = 200, message = "[文件名称]长度必须在[200]以内!")
    private String filename;

    @Size(min = 0, max = 500, message = "[文件路径]长度必须在[500]以内!")
    private String filepath;

    @Size(min = 0, max = 20, message = "[特定目录]长度必须在[20]以内!")
    private String folder;

    @NotBlank(message = "[建立人]不允许为空!")
    @Size(min = 0, max = 60, message = "[建立人]长度必须在[60]以内!")
    @TableField(fill = FieldFill.INSERT)
    private String createman;

    @NotNull(message = "[建立时间]不允许为空!")
    @TableField(fill = FieldFill.INSERT)
    private Timestamp createdate;

    @NotBlank(message = "[更新人]不允许为空!")
    @Size(min = 0, max = 60, message = "[更新人]长度必须在[60]以内!")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private String updateman;

    @NotNull(message = "[更新时间]不允许为空!")
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Timestamp updatedate;

    @Size(min = 0, max = 10, message = "[扩展名]长度必须在[10]以内!")
    private String fileext;

    private Integer filesize;

    @Size(min = 0, max = 64, message = "[摘要数据]长度必须在[64]以内!")
    private String digestcode;

    @Size(min = 0, max = 100, message = "[所有者类型]长度必须在[100]以内!")
    private String ownertype;

    @Size(min = 0, max = 100, message = "[所有者标识]长度必须在[100]以内!")
    private String ownerid;

    @Size(min = 0, max = 500, message = "[备注]长度必须在[500]以内!")
    private String memo;

    @Size(min = 0, max = 100, message = "[保留字段]长度必须在[100]以内!")
    private String reserver;

    /**
     *  获取属性值[建立时间]
     */
    public Timestamp getCreatedate(){
        if(ObjectUtils.isEmpty(createdate)) {
            this.createdate = new Timestamp(new Date().getTime());
        }
        return this.createdate;
    }
    /**
     *  获取属性值[更新时间]
     */
    public Timestamp getUpdatedate(){
        if(ObjectUtils.isEmpty(updatedate)) {
            this.updatedate = new Timestamp(new Date().getTime());
        }
        return this.updatedate;
    }
}