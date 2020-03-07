package net.ibizsys.ocr.ibizutil.helper;

import net.ibizsys.ocr.ibizutil.annotation.Audit;
import net.ibizsys.ocr.ibizutil.domain.CodeListBase;
import net.ibizsys.ocr.ibizutil.domain.EntityBase;
import org.springframework.util.StringUtils;
import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 *比较工具类：比较两个对象值是否相等，并输入审计明细
 */
public class DataAuditHelper {

    private static DataAuditHelper dataAuditHelper;
    public static DataAuditHelper getInstance(){
        if(dataAuditHelper==null)
            dataAuditHelper = new DataAuditHelper();
        return dataAuditHelper;
    }

    /**
     * 删除
     * @param entity   当前数据
     * @param auditFields  审计字段
     * @return
     */
    public String CompareAuditObjectByInsert(EntityBase entity, Map<Field, Audit> auditFields){
        StringBuffer audioResult=new StringBuffer();
        if(auditFields.size()==0)
            return "";
        for (Map.Entry<Field, Audit> auditField : auditFields.entrySet()) {
            Field field=auditField.getKey();//获取注解字段
            Audit auditAnnotation=auditField.getValue();//拿到注解
            String fieldLogicName=auditAnnotation.fieldLogicName();
            String fieldName=field.getName(); //属性名称
            Object value=entity.get(fieldName);//老属性值
            value=dataTransfer(value,auditAnnotation.dictName(),auditAnnotation.fieldType(),auditAnnotation.format());//属性值转换
            if(!StringUtils.isEmpty(value)){
                audioResult.append(String.format("新增属性[%s],属性值为:[%s]",fieldLogicName,value));
                audioResult.append("\r\n");
            }
        }
        return audioResult.toString();
    }

    /**
     * 更新
     * @param oldData   老数据
     * @param newData   新数据
     * @param auditFields  审计字段
     * @return
     */
    public String CompareAuditObjectByUpdate(EntityBase oldData, EntityBase newData, Map<Field, Audit> auditFields){
        StringBuffer audioResult=new StringBuffer();
        if(auditFields.size()==0)
            return "";

        for (Map.Entry<Field, Audit> auditField : auditFields.entrySet()) {
            Field field=auditField.getKey();//获取注解字段
            String fieldName=field.getName(); //属性名称
            Audit auditAnnotation=auditField.getValue();//拿到注解
            String fieldLogicName=auditAnnotation.fieldLogicName();//获取字段逻辑名称
            Object oldValue=oldData.get(fieldName);//老属性值
            Object newValue=newData.get(fieldName);//新属性值
            if(!Compare(oldValue,newValue)){
                oldValue=dataTransfer(oldValue,auditAnnotation.dictName(),auditAnnotation.fieldType(),auditAnnotation.format());//属性值转换
                newValue=dataTransfer(newValue,auditAnnotation.dictName(),auditAnnotation.fieldType(),auditAnnotation.format());//属性值转换
                audioResult.append(String.format("修改属性[%s],原值为:[%s],修改后值为:[%s]",fieldLogicName,oldValue,newValue));
                audioResult.append("\r\n");
            }
        }
        return audioResult.toString();
    }

    /**
     *新建
     * @param entity   当前数据
     * @param auditFields  审计字段
     * @return
     */
    public String CompareAuditObjectByRemove(EntityBase entity, Map<Field, Audit> auditFields){
        StringBuffer audioResult=new StringBuffer();
        if(auditFields.size()==0)
            return "";
        for (Map.Entry<Field, Audit> auditField : auditFields.entrySet()) {
            Field field=auditField.getKey();//获取注解字段
            Audit auditAnnotation=auditField.getValue();//拿到注解
            String fieldLogicName=auditAnnotation.fieldLogicName();
            String fieldName=field.getName(); //属性名称
            Object value=entity.get(fieldName);//老属性值
            value=dataTransfer(value,auditAnnotation.dictName(),auditAnnotation.fieldType(),auditAnnotation.format());//属性值转换
            if(!StringUtils.isEmpty(value)){
                audioResult.append(String.format("删除属性[%s],属性值为:[%s]",fieldLogicName,value));
                audioResult.append("\r\n");
            }
        }
        return audioResult.toString();
    }

    /**
     * 对象比较
     * @param sourceObj 比较源对象
     * @param targetObj 比较目标对象
     * @return
     */
    private boolean Compare(Object sourceObj,Object targetObj){
        if(sourceObj==null && targetObj==null)
            return true;
        if(sourceObj==null && targetObj!=null)
            return false;
        return sourceObj.equals(targetObj);
    }

    /**
     * 数据转换
     * @param value 转换值
     * @param dictName 代码表
     * @param dataType 转换字段类型
     * @param format   转换字段格式化文本
     * @return
     */
    private String dataTransfer(Object value ,String dictName,String dataType, String format){
        if(value==null)
            return "";
        String transResult=value.toString();
        if(!StringUtils.isEmpty(dictName)){ //代码表转换
            transResult=processDict(dictName,value);
        }
        if((dataType.equals("DATE") || dataType.equals("DATETIME") || dataType.equals("TIME")) && (!StringUtils.isEmpty(format))){  //时间类型转换
            transResult=processTime(value,format);
        }
        return transResult;
    }

    /**
     * 代码表字段转换
     * @param dictName 代码表名称
     * @param value   转换字段值
     * @return
     */
    private String processDict(String dictName,Object value){
        String strValue="";
        if(value!=null)
            strValue=value.toString();
        return CodeListBase.getCodeListText(dictName,strValue);
    }

    /**
     * 时间属性格式转换
     * @param dataValue 转换字段值
     * @param dataFormat 转换字段格式化文本
     * @return
     */
    private String processTime(Object dataValue ,String dataFormat){
        Timestamp timestamp =(Timestamp)dataValue;
        Date date =timestamp;
        SimpleDateFormat format =new SimpleDateFormat(dataFormat);
        String strDate=format.format(date);
        return strDate;
    }
}