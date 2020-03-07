package net.ibizsys.ocr.ibizutil.chart.model;

import net.ibizsys.ocr.ibizutil.chart.IChartAxisModel;
import net.ibizsys.ocr.ibizutil.chart.IChartModel;
import net.ibizsys.ocr.ibizutil.chart.IChartSeriesModel;

import java.util.ArrayList;
import java.util.Iterator;

public abstract class ChartModelBase implements IChartModel {
    private ArrayList<IChartAxisModel> chartAxisModelList = new ArrayList<IChartAxisModel>();
    private ArrayList<IChartSeriesModel> chartSeriesModelList = new ArrayList<IChartSeriesModel>();
    public void onInit() throws Exception {
        prepareChartAxisModels();
        prepareChartSeriesModels();
    }
    /**
     * 准备图表图形序列
     *
     * @throws Exception
     */
    protected void prepareChartSeriesModels() throws Exception {

    }

    /**
     * 准备图表坐标轴
     *
     * @throws Exception
     */
    protected void prepareChartAxisModels() throws Exception {

    }

    /**
     * 增加图表坐标轴
     *
     * @param iChartAxisModel
     */
    protected void registerChartAxisModel(IChartAxisModel iChartAxisModel) {
        this.chartAxisModelList.add(iChartAxisModel);
    }

    /**
     * 增加图表序列
     *
     * @param iChartSeriesModel
     */
    protected void registerChartSeriesModel(IChartSeriesModel iChartSeriesModel) {
        this.chartSeriesModelList.add(iChartSeriesModel);
    }
    /*
     * (non-Javadoc)
     *
     * @see net.ibizsys.paas.ctrlmodel.IChartModel#getChartAxisModel()
     */
    public Iterator<IChartAxisModel> getChartAxisModels() {
        return this.chartAxisModelList.iterator();
    }

    /*
     * (non-Javadoc)
     *
     * @see net.ibizsys.paas.ctrlmodel.IChartModel#getChartSerieModels()
     */
    public Iterator<IChartSeriesModel> getChartSeriesModels() {
        return this.chartSeriesModelList.iterator();
    }
}
