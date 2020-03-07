package net.ibizsys.ocr.ibizutil.chart;

/**
 * 图表序列接口
 *
 * @author Administrator
 *
 */
public interface IChartSeriesModel{
    /**
     * 获取标识
     *
     * @return
     */
    String getId();

    /**
     * 获取名称
     *
     * @return
     */
    String getName();
    /**
     * area
     */
    static String SERIESTYPE_AREA = "area";

    /**
     * bar
     */
    static String SERIESTYPE_BAR = "bar";

    /**
     * bar3d
     */
    static String SERIESTYPE_BAR3D = "bar3d";

    /**
     * column
     */
    static String SERIESTYPE_COLUMN = "column";

    /**
     * candlestick
     */
    static String SERIESTYPE_CANDLESTICK = "candlestick";

    /**
     * gauge
     */
    static String SERIESTYPE_GAUGE = "gauge";

    /**
     * line
     */
    static String SERIESTYPE_LINE = "line";

    /**
     * pie
     */
    static String SERIESTYPE_PIE = "pie";

    /**
     * pie3d
     */
    static String SERIESTYPE_PIE3D = "pie3d";

    /**
     * radar
     */
    static String SERIESTYPE_RADAR = "radar";

    /**
     * scatter
     */
    static String SERIESTYPE_SCATTER = "scatter";

    /**
     * 年
     */
    static String TIMEGROUP_YEAR = "YEAR";

    /**
     * 季度
     */
    static String TIMEGROUP_QUARTER = "QUARTER";

    /**
     * 月份
     */
    static String TIMEGROUP_MONTH = "MONTH";

    /**
     * 年周
     */
    static String TIMEGROUP_YEARWEEK = "YEARWEEK";

    /**
     * 日
     */
    static String TIMEGROUP_DAY = "DAY";

    /**
     * 获取标题
     *
     * @return
     */
    String getCaption();

    /**
     * 获取数据序列类型
     *
     * @return
     */
    String getSeriesType();

    /**
     * 获取分类值属性
     *
     * @return
     */
    String getCatalogField();

    /**
     * 获取分类值属性代码表标识
     *
     * @return
     */
    String getCatalogFieldCodeListId();

    /**
     * 获取值属性
     *
     * @return
     */
    String getValueField();

    /**
     * 获取值2属性
     *
     * @return
     */
    String getValue2Field();

    /**
     * 获取值3属性
     *
     * @return
     */
    String getValue3Field();

    /**
     * 获取值4属性
     *
     * @return
     */
    String getValue4Field();

    /**
     * 获取序列属性
     *
     * @return
     */
    String getSeriesField();

    /**
     * 获取序列属性代码表标识
     *
     * @return
     */
    String getSeriesFieldCodeListId();

    /**
     * 获取时间自动分组模式
     *
     * @return
     */
    String getTimeGroupMode();
}

