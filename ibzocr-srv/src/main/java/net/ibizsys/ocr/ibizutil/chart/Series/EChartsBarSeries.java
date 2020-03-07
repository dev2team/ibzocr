package net.ibizsys.ocr.ibizutil.chart.Series;

import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.chart.Axis.EChartsPoint;

import java.util.ArrayList;


/**
 * ECharts 柱图序列对象
 *
 * @author Administrator
 *
 */
public class EChartsBarSeries extends EChartsSeries {
    /*
     * (non-Javadoc)
     *
     * @see net.ibizsys.paas.web.util.echarts.EChartsSeries#onFillSeriesJO(net.sf.json.JSONObject, java.util.ArrayList)
     */
    @Override
    protected void onFillSeriesJO(JSONObject series, ArrayList<String> globalCatalogNameList) throws Exception {
        ArrayList<Double> dataList = new ArrayList<Double>();
        for (String strCatalogName : globalCatalogNameList) {
            EChartsPoint echartsPoint = this.getEChartsPoint(strCatalogName);
            if (echartsPoint != null) {
                dataList.add(echartsPoint.getValue());
            } else {
                dataList.add(0.0);
            }

        }
        series.put("data", dataList.toArray());
    }
}
