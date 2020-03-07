package net.ibizsys.ocr.ibizutil.chart.Axis;
import java.util.ArrayList;

import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.chart.IChartAxisModel;
import org.springframework.util.StringUtils;

/**
 * ECharts XY 左右轴对象
 *
 * @author Administrator
 *
 */
public class EChartsXYAxis extends EChartsAxis {

    public EChartsXYAxis(IChartAxisModel iChartAxisModel)  {
        super(iChartAxisModel);
    }

    @Override
    protected void onFillAxisJO(JSONObject jo, ArrayList<String> globalCatalogNameList) throws Exception {
        if (!StringUtils.isEmpty(this.getChartAxisModel().getAxisPos())) {
            jo.put("position", this.getChartAxisModel().getAxisPos());
        }

        if (this.getChartAxisModel().getAxisType().equals(IChartAxisModel.AXISTYPE_NUMERIC)) {
            jo.put("type", "value");
        } else if (this.getChartAxisModel().getAxisType().equals(IChartAxisModel.AXISTYPE_CATEGORY)) {
            jo.put("type", "category");
            jo.put("data", globalCatalogNameList.toArray());
        } else
            jo.put("type", "value");
    }
}