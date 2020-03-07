package net.ibizsys.ocr.ibizutil.chart;

/**
 * 图表部件模型接口
 *
 * @author lionlau
 *
 */
public interface IChartAxisModel {
    /**
     * left
     */
    static String AXISPOS_LEFT = "left";

    /**
     * bottom
     */
    static String AXISPOS_BOTTOM = "bottom";

    /**
     * right
     */
    static String AXISPOS_RIGHT = "right";

    /**
     * top
     */
    static String AXISPOS_TOP = "top";

    /**
     * radial
     */
    static String AXISPOS_RADIAL = "radial";

    /**
     * angular
     */
    static String AXISPOS_ANGULAR = "angular";

    // 定义类型代码表

    /**
     * numeric
     */
    static String AXISTYPE_NUMERIC = "numeric";

    /**
     * time
     */
    static String AXISTYPE_TIME = "time";

    /**
     * category
     */
    static String AXISTYPE_CATEGORY = "category";

    /**
     * 获取标题
     *
     * @return
     */
    String getCaption();

    /**
     * 获取坐标轴类型
     *
     * @return
     */
    String getAxisType();

    /**
     * 获取坐标轴位置
     *
     * @return
     */
    String getAxisPos();
}

