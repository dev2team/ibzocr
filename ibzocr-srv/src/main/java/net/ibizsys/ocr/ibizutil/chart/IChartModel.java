package net.ibizsys.ocr.ibizutil.chart;

/**
 * 图表部件模型接口
 *
 * @author lionlau
 *
 */
public interface IChartModel{
    /**
     * 获取图表坐标轴集合
     *
     * @return
     */
    java.util.Iterator<IChartAxisModel> getChartAxisModels();

    /**
     * 获取图表坐数据序列集合
     *
     * @return
     */
    java.util.Iterator<IChartSeriesModel> getChartSeriesModels();
}

