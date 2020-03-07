package net.ibizsys.ocr.ibizutil.chart.model;

import net.ibizsys.ocr.ibizutil.chart.IChartAxisModel;

/**
 * 图表坐标轴模型
 *
 * @author Administrator
 *
 */
public class ChartAxisModel  implements IChartAxisModel {
    private String strCaption = null;
    private String strAxisType = null;
    private String strAxisPos = null;
    protected String strId = null;
    protected String strName = null;

    /**
     * 设置图表轴标识
     *
     * @param strId
     */
    public void setId(String strId) {
        this.strId = strId;
    }

    /**
     * 设置图表轴名称
     *
     * @param strName
     */
    public void setName(String strName) {
        this.strName = strName;
    }

    /**
     * 获取图表轴标题
     *
     * @return the strCaption
     */
    public String getCaption() {
        return strCaption;
    }

    /**
     * 设置图表轴标题
     *
     * @param strCaption the strCaption to set
     */
    public void setCaption(String strCaption) {
        this.strCaption = strCaption;
    }

    /**
     * 获取图表轴类型
     *
     * @return the strAxisType
     */
    public String getAxisType() {
        return strAxisType;
    }

    /**
     * 设置图表轴类型
     *
     * @param strAxisType the strAxisType to set
     */
    public void setAxisType(String strAxisType) {
        this.strAxisType = strAxisType;
    }

    /**
     * 获取图表轴位置
     *
     * @return the strAxisPos
     */
    public String getAxisPos() {
        return strAxisPos;
    }

    /**
     * 设置图表轴位置
     *
     * @param strAxisPos the strAxisPos to set
     */
    public void setAxisPos(String strAxisPos) {
        this.strAxisPos = strAxisPos;
    }
}