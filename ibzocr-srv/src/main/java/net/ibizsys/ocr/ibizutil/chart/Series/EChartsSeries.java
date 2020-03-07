package net.ibizsys.ocr.ibizutil.chart.Series;

import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.chart.IChartSeriesModel;
import net.ibizsys.ocr.ibizutil.chart.Axis.EChartsPoint;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;

/**
 * Echart 序列
 *
 * @author Administrator
 *
 */
public class EChartsSeries {
    private String strSeriesDataKey = null;
    private String strSeriesTag = null;
    private String strName = null;
    private String strType = null;
    private HashMap<String, EChartsPoint> echartsPointMap = new HashMap<String, EChartsPoint>();

    private ArrayList<String> catalogNameList = new ArrayList<String>();
    private HashMap<String, String> catalogMap = new HashMap<String, String>();

    public static String getSeriesDataKey(IChartSeriesModel iChartSeriesModel, String strSeriesFieldValue){
        String strValue = iChartSeriesModel.getName();
        if(!StringUtils.isEmpty(strSeriesFieldValue)){
            strValue = String.format("%s_%s",strValue, strSeriesFieldValue);
        }
        return strValue;
    }

    public void init(IChartSeriesModel iChartSeriesModel, String strSeriesFieldValue) {
        if(iChartSeriesModel != null){
            this.strSeriesDataKey = EChartsSeries.getSeriesDataKey(iChartSeriesModel, strSeriesFieldValue);
            this.strSeriesTag = iChartSeriesModel.getName();
            this.strType = iChartSeriesModel.getSeriesType();
            this.strName = strSeriesFieldValue;
            if(!StringUtils.isEmpty(iChartSeriesModel.getSeriesFieldCodeListId())){
//                try {
//                    ICodeList iCodeList = (ICodeList)CodeListGlobal.getCodeList(iChartSeriesModel.getSeriesFieldCodeListId());
//                    strName = iCodeList.getCodeListText(strName, true);
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
            }
        }
    }

    /**
     * 获取序列名称
     *
     * @return the strName
     */
    public String getSeriesDataKey() {
        return strSeriesDataKey;
    }

    /**
     * 设置序列名称
     *
     * @param strSeriesDataKey the strSeriesDataKey to set
     */
    public void setSeriesDataKey(String strSeriesDataKey) {
        this.strSeriesDataKey = strSeriesDataKey;
    }

    /**
     * 获取序列名称
     *
     * @return the strName
     */
    public String getSeriesTag() {
        return strSeriesTag;
    }

    /**
     * 设置序列名称
     *
     * @param strSeriesTag the strSeriesTag to set
     */
    public void setSeriesTag(String strSeriesTag) {
        this.strSeriesTag = strSeriesTag;
    }

    /**
     * 获取名称
     *
     * @return the strName
     */
    public String getName() {
        return strName;
    }

    /**
     * 设置名称
     *
     * @param strName the strName to set
     */
    public void setName(String strName) {
        this.strName = strName;
    }

    /**
     * 获取类型
     *
     * @return the strType
     */
    public String getType() {
        return strType;
    }

    /**
     * 设置类型
     *
     * @param strType the strType to set
     */
    public void setType(String strType) {
        this.strType = strType;
    }

    /**
     * 添加分类值
     *
     * @param strName
     * @throws Exception
     */
    public void addCatalog(String strName) throws Exception {
        String strCatalog = catalogMap.get(strName);
        if (strCatalog != null) return;
        this.catalogNameList.add(strName);
        this.catalogMap.put(strName, strName);
    }

    /**
     * 获取全部分类值
     *
     * @return
     */
    public ArrayList<String> getCatalogList() {
        return this.catalogNameList;
    }

    /**
     * 增加数据点
     *
     * @param strCatalog
     * @param fValue
     * @param fValue2
     * @return
     * @throws Exception
     */
    public EChartsPoint addPoint(String strCatalog, Double fValue, Double fValue2) throws Exception {
        return this.addPoint(strCatalog, fValue, fValue2, null, null);
    }

    /**
     * 增加数据点
     *
     * @param strCatalog
     * @param fValue
     * @param fValue2
     * @param fValue3
     * @param fValue4
     * @return
     * @throws Exception
     */
    public EChartsPoint addPoint(String strCatalog, Double fValue, Double fValue2, Double fValue3, Double fValue4) throws Exception {
        this.addCatalog(strCatalog);

        EChartsPoint echartsPoint = echartsPointMap.get(strCatalog);
        if (echartsPoint != null) {
            if (echartsPoint.getValue() != null) {
                if (fValue != null) {
                    echartsPoint.setValue(echartsPoint.getValue() + fValue);
                }
            } else {
                echartsPoint.setValue(fValue);
            }

            if (echartsPoint.getValue2() != null) {
                if (fValue2 != null) {
                    echartsPoint.setValue2(echartsPoint.getValue2() + fValue2);
                }
            } else {
                echartsPoint.setValue2(fValue2);
            }

            if (echartsPoint.getValue3() != null) {
                if (fValue3 != null) {
                    echartsPoint.setValue3(echartsPoint.getValue3() + fValue3);
                }
            } else {
                echartsPoint.setValue3(fValue3);
            }

            if (echartsPoint.getValue4() != null) {
                if (fValue4 != null) {
                    echartsPoint.setValue4(echartsPoint.getValue4() + fValue4);
                }
            } else {
                echartsPoint.setValue4(fValue4);
            }
        } else {
            echartsPoint = new EChartsPoint();
            echartsPoint.setCatalog(strCatalog);
            echartsPoint.setValue(fValue);
            echartsPoint.setValue2(fValue2);
            echartsPoint.setValue3(fValue3);
            echartsPoint.setValue4(fValue4);
            echartsPointMap.put(strCatalog, echartsPoint);
        }

        return echartsPoint;
    }

    /**
     * 获取指定分类数据点
     *
     * @param strCatalog
     * @return
     */
    public EChartsPoint getEChartsPoint(String strCatalog) {
        return echartsPointMap.get(strCatalog);
    }

    /**
     * 获取图形序列结果对象（Json形式）
     *
     * @return
     * @throws Exception
     */
    public JSONObject getSeriesJO(ArrayList<String> globalCatalogNameList) throws Exception {
        JSONObject series = new JSONObject();
        series.put("type", this.getType());
        series.put("seriestag", this.getSeriesTag());
        if (!StringUtils.isEmpty(this.getName())) {
            series.put("name", this.getName());
        }
        onFillSeriesJO(series, globalCatalogNameList);
        return series;
    }

    /**
     * 填充图形序列结果对象（Json形式）
     *
     * @param jo
     * @param globalCatalogNameList
     * @throws Exception
     */
    protected void onFillSeriesJO(JSONObject jo, ArrayList<String> globalCatalogNameList) throws Exception {

    }

}