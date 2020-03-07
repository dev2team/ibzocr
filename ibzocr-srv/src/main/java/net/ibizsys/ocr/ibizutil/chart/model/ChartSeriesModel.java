package net.ibizsys.ocr.ibizutil.chart.model;

import net.ibizsys.ocr.ibizutil.chart.IChartSeriesModel;

/**
 * 图表序列模型基类
 *
 * @author Administrator
 *
 */
public class ChartSeriesModel implements IChartSeriesModel {
    protected String strId = null;
    protected String strName = null;
    private String strCaption = null;
    private String strSeriesType = null;
    private String strTimeGroupMode = null;

    /**
     * 获取X值属性
     *
     * @return
     */
    private String strCatalogField = null;

    /**
     * 获取X值属性代码表标识
     *
     * @return
     */
    private String strCatalogFieldCodeListId = null;

    /**
     * 获取Y值属性
     *
     * @return
     */
    private String strValueField = null;

    /**
     * 获取Z值属性
     *
     * @return
     */
    private String strValue2Field = null;

    /**
     * 获取值3属性
     *
     * @return
     */
    private String strValue3Field = null;

    /**
     * 获取值4属性
     *
     * @return
     */
    private String strValue4Field = null;

    /**
     * 获取Z值属性
     *
     * @return
     */
    private String strSeriesField = null;

    /**
     * 获取Z值属性代码表标识
     *
     * @return
     */
    private String strSeriesFieldCodeListId = null;

    /**
     * 设置标识
     *
     * @param strId
     */
    public void setId(String strId) {
        this.strId = strId;
    }

    /**
     * 设置名称
     *
     * @param strName
     */
    public void setName(String strName) {
        this.strName = strName;
    }

    @Override
    public String getId() {
        return this.strId;
    }

    @Override
    public String getName() {
        return this.strName;
    }

    /**
     * 获取标题
     *
     * @return the strCaption
     */
    public String getCaption() {
        return strCaption;
    }

    /**
     * 设置标题
     *
     * @param strCaption the strCaption to set
     */
    public void setCaption(String strCaption) {
        this.strCaption = strCaption;
    }

    /**
     * 获取图表序列类型
     *
     * @return the strSeriesType
     */
    
    public String getSeriesType() {
        return strSeriesType;
    }

    /**
     * 设置图表序列类型
     *
     * @param strSeriesType the strSeriesType to set
     */
    public void setSeriesType(String strSeriesType) {
        this.strSeriesType = strSeriesType;
    }

    /**
     * 获取分类属性
     *
     * @return the strCatalogField
     */
    
    public String getCatalogField() {
        return strCatalogField;
    }

    /**
     * 设置分类属性
     *
     * @param strCatalogField the strCatalogField to set
     */
    public void setCatalogField(String strCatalogField) {
        this.strCatalogField = strCatalogField;
    }

    /**
     * 获取分类属性代码表标识
     *
     * @return the strCatalogFieldCodeListId
     */

    public String getCatalogFieldCodeListId() {
        return strCatalogFieldCodeListId;
    }

    /**
     * 设置分类属性代码表标识
     *
     * @param strCatalogFieldCodeListId the strCatalogFieldCodeListId to set
     */
    public void setCatalogFieldCodeListId(String strCatalogFieldCodeListId) {
        this.strCatalogFieldCodeListId = strCatalogFieldCodeListId;
    }

    /**
     * 获取值属性
     *
     * @return the strValueField
     */

    public String getValueField() {
        return strValueField;
    }

    /**
     * 设置值属性
     *
     * @param strValueField the strValueField to set
     */
    public void setValueField(String strValueField) {
        this.strValueField = strValueField;
    }

    /**
     * 获取值2属性
     *
     * @return the strValue2Field
     */
    public String getValue2Field() {
        return strValue2Field;
    }

    /**
     * 设置值2属性
     *
     * @param strValue2Field the strValue2Field to set
     */
    public void setValue2Field(String strValue2Field) {
        this.strValue2Field = strValue2Field;
    }

    /**
     * 获取值3属性
     *
     * @return the strValue2Field
     */
    public String getValue3Field() {
        return strValue3Field;
    }

    /**
     * 设置值3属性
     *
     */
    public void setValue3Field(String strValue3Field) {
        this.strValue3Field = strValue3Field;
    }

    /**
     * 获取值4属性
     *
     * @return the strValue2Field
     */
    public String getValue4Field() {
        return strValue4Field;
    }

    /**
     * 设置值4属性
     *
     */
    public void setValue4Field(String strValue4Field) {
        this.strValue4Field = strValue4Field;
    }

    /**
     * 获取多序列识别属性
     *
     * @return the strSeriesField
     */
    public String getSeriesField() {
        return strSeriesField;
    }

    /**
     * 设置多序列识别属性
     *
     * @param strSeriesField the strSeriesField to set
     */
    public void setSeriesField(String strSeriesField) {
        this.strSeriesField = strSeriesField;
    }

    /**
     * 获取多序列识别属性代码表
     *
     * @return the strSeriesFieldCodeListId
     */
    public String getSeriesFieldCodeListId() {
        return strSeriesFieldCodeListId;
    }

    /**
     * 设置多序列识别属性代码表
     *
     * @param strSeriesFieldCodeListId the strSeriesFieldCodeListId to set
     */
    public void setSeriesFieldCodeListId(String strSeriesFieldCodeListId) {
        this.strSeriesFieldCodeListId = strSeriesFieldCodeListId;
    }

    /*
     * (non-Javadoc)
     *
     * @see net.ibizsys.paas.ctrlmodel.IChartSeriesModel#getTimeGroupMode()
     */
    public String getTimeGroupMode() {
        return this.strTimeGroupMode;
    }

    /**
     * 设置时间分组模式
     *
     * @param strTimeGroupMode
     */
    public void setTimeGroupMode(String strTimeGroupMode) {
        this.strTimeGroupMode = strTimeGroupMode;
    }

}