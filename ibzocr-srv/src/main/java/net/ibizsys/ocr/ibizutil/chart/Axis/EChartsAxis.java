package net.ibizsys.ocr.ibizutil.chart.Axis;

import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.chart.IChartAxisModel;

import java.util.ArrayList;


/**
 * ECharts 坐标轴对象
 *
 * @author Administrator
 *
 */
public class EChartsAxis {
    private IChartAxisModel iChartAxisModel = null;

    /**
     *
     * @param iChartAxisModel
     * @throws Exception
     */
    public EChartsAxis(IChartAxisModel iChartAxisModel) {
        this.iChartAxisModel = iChartAxisModel;
        this.onInit();
    }

    /**
     * 初始化触发
     *
     * @throws Exception
     */
    protected void onInit()  {

    }

    /**
     * 获取图表坐标轴模型对象
     *
     * @return
     */
    public IChartAxisModel getChartAxisModel() {
        return this.iChartAxisModel;
    }

    /**
     * 获取坐标轴Json对象
     *
     * @return
     * @throws Exception
     */
    public JSONObject getAxisJO(ArrayList<String> globalCatalogNameList) throws Exception {
        JSONObject axis = new JSONObject();
        onFillAxisJO(axis, globalCatalogNameList);
        return axis;
    }

    /**
     * 填充坐标轴Json对象
     *
     * @param jo
     * @throws Exception
     */
    protected void onFillAxisJO(JSONObject jo, ArrayList<String> globalCatalogNameList) throws Exception {

    }

}
