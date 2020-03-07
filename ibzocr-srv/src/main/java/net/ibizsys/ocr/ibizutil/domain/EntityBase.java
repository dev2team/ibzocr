package net.ibizsys.ocr.ibizutil.domain;

import net.ibizsys.ocr.ibizutil.annotation.Dict;
import org.springframework.cglib.beans.BeanMap;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import java.lang.reflect.Field;
import java.util.*;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.io.Serializable;
import java.lang.reflect.Field;
import net.ibizsys.ocr.ibizutil.annotation.PreField;
import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnore;
import net.ibizsys.ocr.ibizutil.annotation.Audit;
import com.fasterxml.jackson.annotation.JsonFormat;

public class EntityBase
{
	@TableField(exist = false)
	public Map<String,Object> extensions=new HashMap<String,Object>();
	@TableField(exist = false)
	private BeanMap map;

	public Object get(String field) {
		field=field.toLowerCase();
		if(CacheFieldMap.getFieldMap(this.getClass().getName()).containsKey(field))
			return getMap().get(field);
		else
			return this.extensions.get(field);
	}

	public void set(String field,Object value) {
		field=field.toLowerCase();
		if(CacheFieldMap.getFieldMap(this.getClass().getName()).containsKey(field))
			this.getMap().put(field,value);
		else
			this.extensions.put(field,value);
	}
	@JsonIgnore
	@JSONField(serialize = false)
	public Object getSrfkey() {
		return null;
	}

	@JsonIgnore
	@JSONField(serialize = false)
	public void setSrfkey(Object srfkey) {

	}

	private BeanMap getMap()
	{
		if(map==null)
			map=BeanMap.create(this);
		return  map;
	}

	public Serializable getDefaultPrimaryKey() {
		return IdWorker.get32UUID();
	}

	public void FillDict() {
		List<Field> fields =  CacheFieldMap.getFields(this.getClass().getName());
		for(Field field:fields){
			Object value=this.get(field.getName());
			if(ObjectUtils.isEmpty(value))
				continue;
			Dict dict=field.getAnnotation(Dict.class);
			if(!ObjectUtils.isEmpty(dict)) {
				String dictName=dict.dictName();
				String textField=dict.textField();
				if(StringUtils.isEmpty(textField))
					textField=field.getName()+"_dicttext";
				this.extensions.put(textField,CodeListBase.getCodeListText(dictName,this.get(field.getName()).toString()));
			}
		}
	}

    /**
    * 获取预置属性字段集合
    * @return
    */
    public Map <Field,PreField> SearchPreField(){
    	List<Field> fields =  CacheFieldMap.getFields(this.getClass().getName());
        Map <Field,PreField> preFieldMap =new HashMap<>();

        for(Field field:fields){
        	PreField prefield=field.getAnnotation(PreField.class);
        	if(!ObjectUtils.isEmpty(prefield)) {
       			 preFieldMap.put(field,prefield);
       		 }
        }
       		return preFieldMap;
    }

	/**
	* 获取实体审计属性
	* @return
	*/
	@JsonIgnore
	@JSONField(serialize = false)
	public Map <Field, Audit> getAuditField(){
        List<Field> fields =  CacheFieldMap.getFields(this.getClass().getName());
		Map <Field,Audit> auditFieldMap =new HashMap<>();
		for(Field field:fields){
			Audit audit=field.getAnnotation(Audit.class);
			if(!ObjectUtils.isEmpty(audit))
			{
				auditFieldMap.put(field,audit);
			}
		}
		return auditFieldMap;
	}
	/**
	* 获取实体代码表字段集合
	* @return
	*/
	@JsonIgnore
	@JSONField(serialize = false)
	public Map <String, Dict> getDictField(){
	List<Field> fields =  CacheFieldMap.getFields(this.getClass().getName());
		Map <String,Dict> dictFieldMap =new HashMap<>();
		for(Field field:fields){
		Dict dict=field.getAnnotation(Dict.class);
		if(!ObjectUtils.isEmpty(dict)) {
			dictFieldMap.put(field.getName(),dict);
			}
		}
		return dictFieldMap;
	}
	/**
	* 获取时间字段集合
	* @return
	*/
	@JsonIgnore
	@JSONField(serialize = false)
	public Map <String, JsonFormat> getDateField(){
	List<Field> fields =  CacheFieldMap.getFields(this.getClass().getName());
		Map <String, JsonFormat> dateFieldMap =new HashMap<>();
		for(Field field:fields){
		JsonFormat date=field.getAnnotation(JsonFormat.class);
		if(!ObjectUtils.isEmpty(date)) {
			dateFieldMap.put(field.getName(),date);
			}
		}
		return dateFieldMap;
	}
	public static class CacheFieldMap {
		private static Hashtable<String, Hashtable<String,Field>> cacheMap = new Hashtable<>();
        public static Hashtable<String,Field> getFieldMap(String className) {
			if(className.indexOf("_$")>0)
				className=className.substring(0, className.lastIndexOf("_$"));
			Class clazz = null;
			try {
				clazz = Class.forName(className);
			}
			catch (Exception ex) {
				return new Hashtable<String,Field>();
			}
			if(cacheMap.containsKey(className))
				return cacheMap.get(className);
			synchronized (CacheFieldMap.class) {
				Hashtable<String,Field> result = cacheMap.get(className);
				if (result == null) {
					result=new Hashtable<String,Field>();
					Field[] fields=clazz.getDeclaredFields();
					for(Field field:fields){
						result.put(field.getName(),field);
					}
					cacheMap.put(className, result);
				}
				return result;
			}
		}
		private static List<Field> getFields(String className) {
			if(className.indexOf("_$")>0)
				className=className.substring(0, className.lastIndexOf("_$"));
			Hashtable<String,Field> fieldmap=cacheMap.get(className);
			if(fieldmap==null)
				fieldmap=CacheFieldMap.getFieldMap(className);
			Iterator it = fieldmap.keySet().iterator();
			List<Field> list=new ArrayList<Field>();
			while(it.hasNext()) {
				Object key = it.next();
				if(fieldmap.get(key.toString())!=null)
					list.add(fieldmap.get(key.toString()));
			}
			return list;
		}
	}

}
