package net.ibizsys.ocr.ibizutil.domain;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.helper.DataObject;
import org.springframework.cglib.beans.BeanMap;
import org.springframework.util.StringUtils;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;

public class DataObj extends HashMap<String,Object> {

    public DataObj set(String strParamName, Object value)
    {
        this.put(strParamName.toUpperCase(),value);
        return this;
    }
    @Override
    public Object get(Object key) {
        if(key==null)
            return null;
        Object objValue=super.get(key);
        if(objValue==null)
            objValue=super.get(key.toString().toUpperCase());
        if(objValue==null)
            objValue=super.get(key.toString().toLowerCase());
        return objValue;
    }
    public JSONObject getJSONObjectValue(String strParamName)  {
        return getJSONObjectValue(strParamName,new JSONObject());
    }
    public JSONObject getJSONObjectValue(String strParamName, JSONObject jDefault)  {
         return DataObject.getJSONObjectValue(this.get(strParamName),jDefault);
    }
    public List<String> getListValue( String strParamName)  {
        return DataObject.getListValue(strParamName);
    }
    public JSONArray getJSONArrayValue( String strParamName)  {
        return getJSONArrayValue(strParamName,new JSONArray());
    }
    public JSONArray getJSONArrayValue( String strParamName, JSONArray jDefault)  {
        return DataObject.getJSONArrayValue(this.get(strParamName),jDefault);
    }

    public Integer getIntegerValue(String objValue)  {
        return getIntegerValue(objValue, Integer.MIN_VALUE);
    }
    public int getIntegerValue( String strParamName, int nDefault)  {
        return DataObject.getIntegerValue(this.get(strParamName),nDefault);
    }
    public Float getFloatValue(String objValue)  {
        return this.getFloatValue(objValue,-9999f);
    }
    public Float getFloatValue(  String strParamName, float fDefault)  {
        return DataObject.getFloatValue(this.get(strParamName),fDefault);
    }
    public BigDecimal getBigDecimalValue(String objValue)  {
        return this.getBigDecimalValue(objValue,BigDecimal.valueOf(-9999));
    }
    public BigDecimal getBigDecimalValue(  String strParamName, BigDecimal fDefault)  {
        return DataObject.getBigDecimalValue(this.get(strParamName),fDefault);
    }
    public Long getLongValue( String strParamName)  {
        return this.getLongValue(strParamName,Long.MIN_VALUE);
    }
    public Long getLongValue( String strParamName, long nDefault)  {
        return DataObject.getLongValue(this.get(strParamName),nDefault);
    }
    public String getStringValue(String objValue)  {
        return getStringValue(objValue, "");
    }
    public String getStringValue( String strParamName, String strDefault)  {
        return DataObject.getStringValue(this.get(strParamName),strDefault);
    }
    public byte[] getBinaryValue(String objValue)  {
        return getBinaryValue(objValue, null);
    }

    public byte[] getBinaryValue(String strParamName, byte[] def)  {
        return DataObject.getBinaryValue(this.get(strParamName),def);
    }
    public Timestamp getTimestampBegin( String strParamName)  {
        return getTimestampValue(strParamName,DataObject.getBeginDate());
    }
    public Timestamp getTimestampEnd( String strParamName)  {
        Object objValue = this.get(strParamName);
        if (objValue == null) {
            return DataObject.getEndDate();
        }
        try {
            Timestamp t= DataObject.getTimestampValue(objValue);
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            String time = df.format(t);
            Calendar cl=Calendar.getInstance(TimeZone.getTimeZone("GMT+8"));
            cl.setTime(Timestamp.valueOf(time+" 23:59:59"));
            return new Timestamp(cl.getTime().getTime());
        } catch (Exception ex) {
            return DataObject.getEndDate();
        }

    }
    public Timestamp getTimestampValue( String strParamName, Timestamp dtDefault)  {
        Object objValue = this.get(strParamName);
        if (objValue == null) {
            return dtDefault;
        }
        try {
            return DataObject.getTimestampValue(objValue);
        } catch (Exception ex) {
            return dtDefault;
        }
    }
    public void copyTo(Object obj)
    {
        List<Field>  map= CacheFieldMap.getFields(obj.getClass().getName());
        BeanMap beanMap=BeanMap.create(obj);
        for(Field field:map)
        {
            Object source=this.get(field.getName());
            if(source!=null)
            {
                if(source instanceof BigDecimal)
                {
                    BigDecimal decimal=(BigDecimal)source;
                    if(field.getType().equals(Double.class) )
                    {
                        beanMap.put(field.getName(),(decimal.doubleValue()));
                    }
                    else  if(field.getType().equals(Float.class) )
                    {
                        beanMap.put(field.getName(),(decimal.floatValue()));
                    }
                    else  if(field.getType().equals(BigInteger.class) )
                    {
                        beanMap.put(field.getName(),(decimal.toBigInteger()));
                    }
                    else  if(field.getType().equals(Integer.class) )
                    {
                        beanMap.put(field.getName(),(decimal.intValue()));
                    }
                    else  if(field.getType().equals(String.class) )
                    {
                        beanMap.put(field.getName(),(decimal.toString()));
                    }
                    continue;
                }
                else if(source instanceof Long)
                {
                    Long long1=(Long)source;
                    if(field.getType().equals(Integer.class) )
                    {
                        beanMap.put(field.getName(),(long1.intValue()));
                    }
                    else  if(field.getType().equals(String.class) )
                    {
                        beanMap.put(field.getName(),(long1.toString()));
                    }
                    continue;
                }

                beanMap.put(field.getName(),source);
            }
        }
    }
    public void copyFrom(Object obj)
    {
        List<Field>  map= CacheFieldMap.getFields(obj.getClass().getName());
        BeanMap beanMap=BeanMap.create(obj);
        for(Field field:map)
        {
            if(this.containsKey(field.getName().toUpperCase()))
            {
                this.set(field.getName().toUpperCase(),beanMap.get(field.getName())) ;
            }
        }
    }
    public static class CacheFieldMap {
        private static Hashtable<String, Hashtable<String, Field>> cacheMap = new Hashtable<>();
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
                fieldmap= CacheFieldMap.getFieldMap(className);
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
