package net.ibizsys.ocr.ibizutil.helper;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.util.StringUtils;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public class DataObject {

    final static public DateFormat datetimeFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    final static public DateFormat datetimeFormat2 = new SimpleDateFormat("yyyy-MM-dd HH:mm");
    final static public DateFormat dayFormat = new SimpleDateFormat("yyyy-MM-dd");

    final static public String getStringValue(Object objValue, String strDefault)  {
        if (objValue == null) return strDefault;
        if (objValue instanceof String) return (String) objValue;
        if (objValue instanceof java.sql.Timestamp||objValue instanceof java.sql.Date||objValue instanceof java.util.Date) {
            String rt=datetimeFormat.format(objValue);
            if(rt.endsWith(" 00:00:00"))
                rt=dayFormat.format(objValue);
            else if(rt.endsWith(":00"))
                rt=datetimeFormat2.format(objValue);
            return rt;
        }

        return objValue.toString();
    }

    final static public Double getDoubleValue(Object objValue)  {
        if (objValue == null) return null;

        if (objValue instanceof Double) {
            return (Double) objValue;
        }

        String strValue = objValue.toString();
        if (StringUtils.isEmpty(strValue)) return null;
        strValue = strValue.replace(",", "");
        return Double.parseDouble(strValue);
    }

    final static public JSONObject getJSONObjectValue(Object objValue, JSONObject jDefault)  {
        if (objValue == null) {
            return jDefault;
        }
        if(objValue instanceof JSONObject)
            return (JSONObject)objValue;
        String strValue = objValue.toString();
        try {
            return JSONObject.parseObject(strValue);
        }
        catch (Exception ex)
        {
            return jDefault;
        }
    }

    final static public JSONArray getJSONArrayValue(Object objValue, JSONArray jDefault)  {
        if (objValue == null) {
            return jDefault;
        }
        if(objValue instanceof JSONArray)
            return (JSONArray)objValue;
        String strValue = objValue.toString();
        try {
            return JSONArray.parseArray(strValue);
        }
        catch (Exception ex)
        {
            return jDefault;
        }
    }

    final static public List<String> getListValue(Object objValue)  {
        if (objValue == null) {
            return new ArrayList<String>();
        }
        JSONArray arr=(getJSONArrayValue(objValue,null));
        if(arr!=null)
        {
            List<String> chk1=new ArrayList<>();
            for(int i=0;i<arr.size();i++)
            {
                if(arr.get(i) instanceof  String)
                    chk1.add(arr.getString(i));
            }
            return chk1;
        }
        else
        {
            return new ArrayList<String>();
        }

    }



    final static public int getIntegerValue( Object objValue, int nDefault)  {

        if (objValue == null) {
            return nDefault;
        }

        if(objValue instanceof Integer)
            return (Integer)objValue;

        if (objValue instanceof Double) {
            return ((Double) objValue).intValue();
        }

        if (objValue instanceof BigDecimal) {
            return ((BigDecimal) objValue).intValue();
        }

        String strValue = objValue.toString();
        if(StringUtils.isEmpty(strValue))
            return nDefault;
        strValue = strValue.replace(",", "");
        return Integer.parseInt(strValue);
    }

    final static public Float getFloatValue(  Object objValue, float fDefault)  {

        if (objValue == null) {
            return fDefault;
        }
        try {

            if(objValue instanceof Float)
                return (Float)objValue;

            String strValue = objValue.toString();
            if(StringUtils.isEmpty(strValue))
                return fDefault;
            strValue = strValue.replace(",", "");
            return Float.parseFloat(strValue);
        } catch (Exception ex) {
            return fDefault;
        }
    }

    final static public BigDecimal getBigDecimalValue(  Object objValue, BigDecimal fDefault)  {

        if (objValue == null) {
            return fDefault;
        }
        try {
            if(objValue instanceof BigDecimal){
                return (BigDecimal)(objValue);
            }
            if(objValue instanceof Double){
                return BigDecimal.valueOf((Double)objValue);
            }
            if(objValue instanceof Long){
                return BigDecimal.valueOf((Long)objValue);
            }
            String strValue = objValue.toString();
            if(StringUtils.isEmpty(strValue))
                return fDefault;
            strValue = strValue.replace(",", "");
            return BigDecimal.valueOf(Double.parseDouble(strValue));
        } catch (Exception ex) {
            return fDefault;
        }
    }

    final static public Long getLongValue( Object objValue, long nDefault)  {

        if (objValue == null) {
            return nDefault;
        }
        try {
            if (objValue instanceof Long) return (Long) objValue;

            if (objValue instanceof Integer) {
                return ((Integer) objValue).longValue();
            }

            if (objValue instanceof Double) {
                return ((Double) objValue).longValue();
            }

            if (objValue instanceof BigDecimal) {
                return ((BigDecimal) objValue).longValue();
            }

            String strValue = objValue.toString();
            if(StringUtils.isEmpty(strValue))
                return nDefault;
            strValue = strValue.replace(",", "");
            return Long.parseLong(objValue.toString());
        } catch (Exception ex) {
            return nDefault;
        }
    }

    final static public byte[] getBinaryValue(Object objValue, byte[] def)  {

        if (objValue == null) return def;
        if(objValue instanceof byte[]){
            return (byte[])objValue;
        }
        if (objValue instanceof String){
            return Base64.getDecoder().decode((String) objValue);
        }
        return def;
    }

    /**
     * 转换对象值到时间值
     *
     * @param objValue
     * @return
     * @
     */
    final static public java.sql.Timestamp getTimestampValue(Object objValue) throws Exception {
        if (objValue == null) return null;

        if (objValue instanceof java.sql.Timestamp) {
            java.sql.Timestamp ti = (java.sql.Timestamp) objValue;
            return ti;
        }

        if (objValue instanceof java.sql.Date) {
            java.sql.Date date = (java.sql.Date) objValue;
            return new java.sql.Timestamp(date.getTime());
        }

        if (objValue instanceof java.util.Date) {
            java.util.Date date = (java.util.Date) objValue;
            return new java.sql.Timestamp(date.getTime());
        }

        if (objValue instanceof String) {
            String strValue = (String) objValue;
            strValue = strValue.trim();
            if (StringUtils.isEmpty(strValue)) return null;

            java.util.Date date = parse((String) objValue);
            return new java.sql.Timestamp(date.getTime());
        }

        if(objValue instanceof Long)
        {
            Long lValue = (Long)objValue;
            return new  java.sql.Timestamp(lValue);
        }

        if(objValue instanceof Integer)
        {
            int lValue = (int)objValue;
            return new  java.sql.Timestamp(lValue);
        }

        throw new Exception(String.format("无法转换时间[%1$s]", objValue));
    }


    public static Object testDateTime(String strInput)  throws Exception{
        return testDateTime(strInput, null);
    }

    /**
     * 转换文本值到日期时间
     *
     * @param strInput
     * @param timeZone
     * @return
     * @
     */
    public static Object testDateTime(String strInput, TimeZone timeZone)  throws Exception{
        if (StringUtils.isEmpty(strInput)) return null;
        Date dtDate = parse(strInput, timeZone);
        java.sql.Timestamp retDate = new java.sql.Timestamp(dtDate.getTime());
        return retDate;
    }

    /**
     * 转换字符串到时间对象
     *
     * @param strTimeString
     * @return
     * @throws ParseException
     * @
     */
    public static Date parse(String strTimeString) throws ParseException, Exception {
        return parse(strTimeString, null);
    }

    /**
     * 分析时间串
     *
     * @param strTimeString MM/dd/yy yy-MM-dd HH:mm:ss 格式
     * @param timeZone
     * @return
     * @throws ParseException
     * @
     */
    public static Date parse(String strTimeString, TimeZone timeZone) throws ParseException, Exception {
        strTimeString = strTimeString.trim();
        if(StringUtils.isEmpty(strTimeString)){
            throw new Exception("unknown date(time) string");
        }
        if(strTimeString.indexOf("Z")!=-1){
            //有时区
            String[] parts = strTimeString.split("[Z]");
            if(parts.length>=1){
                strTimeString = parts[0];
            }
            if(parts.length>=2){
                if(timeZone == null){
                    if(!StringUtils.isEmpty(parts[1])){
                        timeZone = TimeZone.getTimeZone(parts[1]);
                    }
                }
            }
        }

        // 判断是长数据还是短数据
        String strPart[] = null;
        if(strTimeString.indexOf("T")!=-1){
            strPart = strTimeString.split("[T]");
        }
        else
            strPart = strTimeString.split(" ");
        if (strPart.length == 2) {
            // 两个部分
            String strDate = "";
            String strTime = "";
            if (strPart[0].indexOf(":") != -1) {
                strTime = strPart[0];
                strDate = strPart[1];
            } else {
                strTime = strPart[1];
                strDate = strPart[0];
            }
            strDate = strDate.trim();
            strTime = strTime.trim();
            strDate = getFormatDateString(strDate);
            strTime = getFormatTimeString(strTime);
            DateFormat dtFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            if (timeZone != null) {
                dtFormat.setTimeZone(timeZone);
            }
            return dtFormat.parse(strDate + " " + strTime);
        } else {
            // 一个部分
            if (strTimeString.indexOf(":") != -1) {
                // 时间
                strTimeString = getFormatTimeString(strTimeString);
                DateFormat dtFormat = new SimpleDateFormat("HH:mm:ss");
                if (timeZone != null) {
                    dtFormat.setTimeZone(timeZone);
                }
                return dtFormat.parse(strTimeString);
            } else {
                // 作为日期处理
                strTimeString = getFormatDateString(strTimeString);
                DateFormat dtFormat = new SimpleDateFormat("yyyy-MM-dd");
                if (timeZone != null) {
                    dtFormat.setTimeZone(timeZone);
                }
                return dtFormat.parse(strTimeString);
            }
        }

    }
    /**
     * 获取时间格式化串
     *
     * @param strOrigin
     * @return
     */
    private static String getFormatTimeString(String strOrigin) {
        int nDotPos = strOrigin.indexOf(".");
        if (nDotPos != -1) {
            strOrigin = strOrigin.substring(0, nDotPos);
        }

        Object Time[] = new Object[3];
        Time[0] = 0;
        Time[1] = 0;
        Time[2] = 0;

        String timepart[] = strOrigin.split(":");
        int nTimePartLength = timepart.length;
        if (nTimePartLength > 3) {
            nTimePartLength = 3;
        }

        for (int i = 0; i < nTimePartLength; i++) {
            Time[i] = Integer.parseInt(timepart[i]);
        }

        return String.format("%1$02d:%2$02d:%3$02d", Time);

    }
    /**
     * 获取时日期格式化串
     *
     * @param strOrigin
     * @return
     * @
     */
    private static String getFormatDateString(String strOrigin)  throws Exception{
        return getFormatDateString(strOrigin, true);
    }

    /**
     * 获取时日期格式化串
     *
     * @param strOrigin
     * @param bAdv
     * @return
     * @
     */
    private static String getFormatDateString(String strOrigin, boolean bAdv)  throws Exception{
        Object Date[] = new Object[3];
        Date[0] = 1970;
        Date[1] = 1;
        Date[2] = 1;

        if (strOrigin.indexOf("-") != -1) {
            String datePart[] = strOrigin.split("-");
            if (datePart.length >= 1) {
                Date[0] = Integer.parseInt(datePart[0]);
            }

            if (datePart.length >= 2) {
                Date[1] = Integer.parseInt(datePart[1]);
            }

            if (datePart.length >= 3) {
                Date[2] = Integer.parseInt(datePart[2]);
            }
        }

        else if (strOrigin.indexOf("/") != -1) {
            String datePart[] = strOrigin.split("/");
            if (datePart.length >= 1) {
                Date[1] = Integer.parseInt(datePart[0]);
            }

            if (datePart.length >= 2) {
                Date[2] = Integer.parseInt(datePart[1]);
            }

            if (datePart.length >= 3) {
                Date[0] = Integer.parseInt(datePart[2]);
            }
        } else {
            if (bAdv) {
                strOrigin = strOrigin.replace(".", "-");
                strOrigin = strOrigin.replace("日", "");
                strOrigin = strOrigin.replace("天", "");
                strOrigin = strOrigin.replace("年", "-");
                strOrigin = strOrigin.replace("月", "-");
                return getFormatDateString(strOrigin, false);
            } else

                throw new Exception("无法识别的时间字符串,"+strOrigin);
        }

        return String.format("%1$04d-%2$02d-%3$02d", Date);
    }
    public static Timestamp getBeginDate()
    {
        Calendar cl=Calendar.getInstance(TimeZone.getTimeZone("GMT+8"));
        cl.set(1900,1,1);
        return new Timestamp(cl.getTime().getTime());

    }
    public static Timestamp getEndDate()
    {
        Calendar cl=Calendar.getInstance(TimeZone.getTimeZone("GMT+8"));
        cl.set(2100,12,31,23,59,59);
        return new Timestamp(cl.getTime().getTime());

    }

    public static Timestamp getNow()
    {
        Calendar cl=Calendar.getInstance(TimeZone.getTimeZone("GMT+8"));

        return new Timestamp(cl.getTime().getTime());

    }
}
