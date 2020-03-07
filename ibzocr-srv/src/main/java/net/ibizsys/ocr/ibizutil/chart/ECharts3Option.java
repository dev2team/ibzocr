package net.ibizsys.ocr.ibizutil.chart;


import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.chart.Axis.EChartsAxis;
import net.ibizsys.ocr.ibizutil.chart.Axis.EChartsPoint;
import net.ibizsys.ocr.ibizutil.chart.Axis.EChartsXYAxis;
import net.ibizsys.ocr.ibizutil.chart.Series.EChartsBarSeries;
import net.ibizsys.ocr.ibizutil.chart.Series.EChartsLineSeries;
import net.ibizsys.ocr.ibizutil.chart.Series.EChartsPieSeries;
import net.ibizsys.ocr.ibizutil.chart.Series.EChartsSeries;
import net.ibizsys.ocr.ibizutil.helper.DataObject;
import org.springframework.util.StringUtils;

import java.util.*;

/**
 * EChart 图表数据对象
 *
 * @author Administrator
 *
 */
public class ECharts3Option {
    private ArrayList<String> seriesNameList = new ArrayList<String>();

    private HashMap<String, EChartsSeries> seriesMap = new HashMap<String, EChartsSeries>();

    private ArrayList<String> catalogNameList = new ArrayList<String>();

    private HashMap<String, String> catalogMap = new HashMap<String, String>();

//    private ArrayList<EChartsCoordinate> coordinateList = new ArrayList<EChartsCoordinate>();

    private ArrayList<EChartsAxis> xAxisList = new ArrayList<EChartsAxis>();

    private ArrayList<EChartsAxis> yAxisList = new ArrayList<EChartsAxis>();

    private IChartModel iChartModel = null;

    /**
     * 年
     */
    public final static int TIMEGROUP_YEAR = 1;

    /**
     * 季度
     */
    public final static int TIMEGROUP_QUARTER = 2;

    /**
     * 月份
     */
    public final static int TIMEGROUP_MONTH = 3;

    /**
     * 年周
     */
    public final static int TIMEGROUP_YEARWEEK = 4;

    /**
     * 日
     */
    public final static int TIMEGROUP_DAY = 5;

    protected static HashMap<String, Integer> timeGroupValueMap = new HashMap<String, Integer>();

    static {
        timeGroupValueMap.put(IChartSeriesModel.TIMEGROUP_YEAR, TIMEGROUP_YEAR);
        timeGroupValueMap.put(IChartSeriesModel.TIMEGROUP_QUARTER, TIMEGROUP_QUARTER);
        timeGroupValueMap.put(IChartSeriesModel.TIMEGROUP_MONTH, TIMEGROUP_MONTH);
        timeGroupValueMap.put(IChartSeriesModel.TIMEGROUP_YEARWEEK, TIMEGROUP_YEARWEEK);
        timeGroupValueMap.put(IChartSeriesModel.TIMEGROUP_DAY, TIMEGROUP_DAY);
    }

    public ECharts3Option(IChartModel iChartModel)  {
        this.iChartModel = iChartModel;
        this.onInit();
    }

    /**
     * 初始化触发
     *
     * @throws Exception
     */
    protected void onInit(){
        // 输出坐标轴
        java.util.Iterator<IChartAxisModel> chartAxisModels = this.getChartModel().getChartAxisModels();
        if (chartAxisModels != null) {
            while (chartAxisModels.hasNext()) {
                IChartAxisModel iChartAxisModel = chartAxisModels.next();
                EChartsAxis eChartsAxis = this.createAxis(iChartAxisModel);
                if (iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_TOP) || iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_BOTTOM)) {
                    xAxisList.add(eChartsAxis);
                    continue;
                }
                if (iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_LEFT) || iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_RIGHT)) {
                    yAxisList.add(eChartsAxis);
                    continue;
                }
            }
        }
    }

    /**
     * 增加图形序列
     *
     * @param iChartSeriesModel
     * @param strSeriesFieldValue
     * @throws Exception
     */
    public EChartsSeries addSeries(IChartSeriesModel iChartSeriesModel, String strSeriesFieldValue) throws Exception {
        String strSeriesDataKey = EChartsSeries.getSeriesDataKey(iChartSeriesModel, strSeriesFieldValue);
        // 增加数据序列
        EChartsSeries eChartsSeries = seriesMap.get(strSeriesDataKey);
        if (eChartsSeries != null)
            return eChartsSeries;

        eChartsSeries = createSeries(iChartSeriesModel,strSeriesFieldValue);

        this.seriesNameList.add(eChartsSeries.getName());
        this.seriesMap.put(strSeriesDataKey, eChartsSeries);
        return eChartsSeries;
    }

    /**
     * 建立图形序列
     *
     * @param iChartSeriesModel
     * @param strSeriesFieldValue
     * @return
     */
    protected EChartsSeries createSeries(IChartSeriesModel iChartSeriesModel, String strSeriesFieldValue) throws Exception {
        EChartsSeries eChartsSeries = null;
        String strType = iChartSeriesModel.getSeriesType();
        if (IChartSeriesModel.SERIESTYPE_PIE.equals(strType)|| IChartSeriesModel.SERIESTYPE_PIE3D.equals(strType)) {
            eChartsSeries = new EChartsPieSeries();
        }
        else if (IChartSeriesModel.SERIESTYPE_LINE.equals(strType)) {
            eChartsSeries = new EChartsLineSeries();
        }
        else if (IChartSeriesModel.SERIESTYPE_BAR.equals(strType) ||IChartSeriesModel.SERIESTYPE_BAR3D.equals(strType)  || IChartSeriesModel.SERIESTYPE_COLUMN.equals(strType)) {
            eChartsSeries = new EChartsBarSeries();
        }
//        else if (StringHelper.compare(strType, IChartSeriesModel.SERIESTYPE_AREA, true) == 0) {
//            eChartsSeries = new EChartsAreaSeries();
//        }
//      else if ((StringHelper.compare(strType, IChartSeriesModel.SERIESTYPE_RADAR, true) == 0) ) {
//            eChartsSeries = new EChartsRadarSeries();
//        }else if ((StringHelper.compare(strType, IChartSeriesModel.SERIESTYPE_GAUGE, true) == 0) ) {
//            eChartsSeries = new EChartsGaugeSeries();
//        }else if ((StringHelper.compare(strType, IChartSeriesModel.SERIESTYPE_CANDLESTICK, true) == 0) ) {
//            eChartsSeries = new EChartsCandlestickSeries();
//        }else if ((StringHelper.compare(strType, IChartSeriesModel.SERIESTYPE_SCATTER, true) == 0) ) {
//            eChartsSeries = new EChartsScatterSeries();
//        }else if (StringHelper.compare(strType, IChartSeriesModel.SERIESTYPE_AREA, true) == 0) {
//            eChartsSeries = new EChartsAreaSeries();
//        }
        else{
            eChartsSeries = new EChartsSeries();
        }
        eChartsSeries.init(iChartSeriesModel, strSeriesFieldValue);

        return eChartsSeries;
    }

    /**
     * 建立图表坐标对象
     *
     * @param iChartAxisModel
     * @return
     * @throws Exception
     */
    protected EChartsAxis createAxis(IChartAxisModel iChartAxisModel)  {
        if (iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_LEFT) || iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_RIGHT) || iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_TOP) ||  iChartAxisModel.getAxisPos().equals(IChartAxisModel.AXISPOS_BOTTOM)) {
            return new EChartsXYAxis(iChartAxisModel);
        }
        return new EChartsAxis(iChartAxisModel);
    }

    /**
     * 增加分组数据
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
     * 获取全部数据序列名称
     *
     * @return
     */
    public ArrayList<String> getSeriesNameList() {
        return this.seriesNameList;
    }

    /**
     * 获取全部分组名称
     *
     * @return
     */
    public ArrayList<String> getCatalogList() {
        return this.catalogNameList;
    }

    /**
     * 增加序列点
     *
     * @param iChartSeriesModel
     * @param strSeriesFieldValue
     * @param strCatalog
     * @param fValue
     * @param fValue2
     * @return
     * @throws Exception
     */
    public EChartsPoint addPoint(IChartSeriesModel iChartSeriesModel, String strSeriesFieldValue, String strCatalog, Double fValue, Double fValue2, Double fValue3, Double fValue4) throws Exception {
        EChartsSeries echartsSeries = this.addSeries(iChartSeriesModel, strSeriesFieldValue);
        this.addCatalog(strCatalog);
        return echartsSeries.addPoint(strCatalog, fValue, fValue2, fValue3, fValue4);
    }

    /**
     * 添加图形序列
     *
     * @param iChartSeriesModel 图形序列对象
     * @param iDataTable 数据表
     * @return
     * @throws Exception
     */
    public void addSeries(IChartSeriesModel iChartSeriesModel, List<Map<String,Object>> iDataTable) throws Exception {
        int nCacheRowCount = iDataTable.size();
        String strTimeGroupMode = iChartSeriesModel.getTimeGroupMode();
        if (!StringUtils.isEmpty(strTimeGroupMode)) {
            // 计算时间最大值及最小值
            String strCatalogName = iChartSeriesModel.getCatalogField();
            if (StringUtils.isEmpty(strCatalogName)) {
                throw new Exception("没有指定时间分组属性");
            }

            java.sql.Timestamp dtBeginTime = null;
            java.sql.Timestamp dtEndTime = null;
            for (int i = 0; i < nCacheRowCount; i++) {
                Map<String,Object> iDataRow = iDataTable.get(i);
                java.sql.Timestamp dtTimestamp = DataObject.getTimestampValue(iDataRow.get(strCatalogName));
                if (dtBeginTime == null) {
                    dtBeginTime = dtTimestamp;
                } else {
                    if (dtTimestamp.getTime() < dtBeginTime.getTime()) {
                        dtBeginTime = dtTimestamp;
                    }
                }
                if (dtEndTime == null) {
                    dtEndTime = dtTimestamp;
                } else {
                    if (dtTimestamp.getTime() > dtEndTime.getTime()) {
                        dtEndTime = dtTimestamp;
                    }
                }
            }

            // 填充时间序列
            if (dtBeginTime != null && dtEndTime != null) {
                this.addTimeCatalog(strTimeGroupMode, dtBeginTime, dtEndTime);
            }
        }
        for (int i = 0; i < nCacheRowCount; i++) {
            Map<String,Object> iDataRow = iDataTable.get(i);
            String strSeriesFieldValue = "";
            String strCatalogName = "";
            Double fValue = null;
            Double fValue2 = null;
            Double fValue3 = null;
            Double fValue4 = null;

            if (!StringUtils.isEmpty(iChartSeriesModel.getSeriesField())) {
                strSeriesFieldValue = DataObject.getStringValue(iDataRow.get(iChartSeriesModel.getSeriesField()), "");
//				if(!StringUtils.isEmpty(iChartSeriesModel.getSeriesFieldCodeListId())){
//					ICodeList iCodeList = (ICodeList)CodeListGlobal.getCodeList(iChartSeriesModel.getSeriesFieldCodeListId());
//					strName = iCodeList.getCodeListText(strName, true);
//				}
            }
            if (!StringUtils.isEmpty((iChartSeriesModel.getCatalogField()))) {
                if (StringUtils.isEmpty(strTimeGroupMode)) {
                    strCatalogName = DataObject.getStringValue(iDataRow.get(iChartSeriesModel.getCatalogField()), "");
//                    if(!StringUtils.isEmpty(iChartSeriesModel.getCatalogFieldCodeListId())){
//                        ICodeList iCodeList = (ICodeList)CodeListGlobal.getCodeList(iChartSeriesModel.getCatalogFieldCodeListId());
//                        strCatalogName = iCodeList.getCodeListText(strCatalogName, true);
//                    }
                } else {
                    java.sql.Timestamp dtTimestamp = DataObject.getTimestampValue(iDataRow.get(iChartSeriesModel.getCatalogField()));
                    strCatalogName = getTimeCatalog(strTimeGroupMode, dtTimestamp);
                }
            }

            if (!StringUtils.isEmpty(iChartSeriesModel.getValueField())) {
                fValue = DataObject.getDoubleValue(iDataRow.get(iChartSeriesModel.getValueField()));
            }
            if (!StringUtils.isEmpty(iChartSeriesModel.getValue2Field())) {
                fValue2 = DataObject.getDoubleValue(iDataRow.get(iChartSeriesModel.getValue2Field()));
            }
            if (!StringUtils.isEmpty(iChartSeriesModel.getValue3Field())) {
                fValue3 = DataObject.getDoubleValue(iDataRow.get(iChartSeriesModel.getValue3Field()));
            }
            if (!StringUtils.isEmpty(iChartSeriesModel.getValue4Field())) {
                fValue4 = DataObject.getDoubleValue(iDataRow.get(iChartSeriesModel.getValue4Field()));
            }

            this.addPoint(iChartSeriesModel, strSeriesFieldValue, strCatalogName, fValue, fValue2, fValue3, fValue4);
        }

    }

    /**
     * 建立图表结果对象
     *
     * @param iChartModel
     * @return
     * @throws Exception
     */
    public static ECharts3Option createEChartsOption(IChartModel iChartModel) {
        ECharts3Option echartsOption = new ECharts3Option(iChartModel);
        return echartsOption;
    }

    /**
     * 加载数据源
     *
     * @param iDataSet
     * @throws Exception
     */
//    public void loadDataSet(IDataSet iDataSet) throws Exception {
//        int nIndex = 0;
//        java.util.Iterator<IChartSeriesModel> chartSeriesModels = this.getChartModel().getChartSeriesModels();
//        while (chartSeriesModels.hasNext()) {
//            IChartSeriesModel iChartSeriesModel = chartSeriesModels.next();
//            IDataTable iDataTable = iDataSet.getDataTable(nIndex);
//            nIndex++;
//            this.addSeries(iChartSeriesModel, iDataTable);
//        }
//    }

    /**
     * 加载数据源
     *
     * @throws Exception
     */
    public void loadDataTable(List<Map<String,Object>> iDataTable) throws Exception {
        java.util.Iterator<IChartSeriesModel> chartSeriesModels = this.getChartModel().getChartSeriesModels();
        while (chartSeriesModels.hasNext()) {
            IChartSeriesModel iChartSeriesModel = chartSeriesModels.next();
            this.addSeries(iChartSeriesModel, iDataTable);
        }
    }

    /**
     * 获取图表结果对象
     *
     * @return
     * @throws Exception
     */
    public JSONObject getOptionJO() throws Exception {
        JSONObject opt = new JSONObject();

        JSONObject legend = new JSONObject();
        boolean bUseCat = false;
        int nSeriesCount = seriesNameList.size();
        switch (nSeriesCount) {
            case 0:
                bUseCat = true;
                break;
            case 1: {
                String strSeriesName = seriesNameList.get(0);
                if (StringUtils.isEmpty(strSeriesName)) {
                    bUseCat = true;
                }
            }
            break;
            default:
                break;
        }

        if (bUseCat) {
            legend.put("data", catalogNameList.toArray());
        } else {
            legend.put("data", seriesNameList.toArray());
        }

        opt.put("legend", legend);

        JSONObject tooltip = null;

        ArrayList<JSONObject> seriesList = new ArrayList<JSONObject>();
        for (String strSeriesName : seriesMap.keySet()) {
            EChartsSeries echartsSeries = seriesMap.get(strSeriesName);
            if (tooltip == null) {
                tooltip = new JSONObject();
                if (echartsSeries.getType().equals(IChartSeriesModel.SERIESTYPE_PIE)) {
                    tooltip.put("trigger", "item");
                    tooltip.put("formatter", "{a} <br/>{b} : {c} ({d}%)");
                }
            }
            JSONObject seriesJO = echartsSeries.getSeriesJO(this.catalogNameList);
            seriesList.add(seriesJO);
        }

        if (seriesList.size() == 1) {
            opt.put("series", seriesList.get(0));
        } else {
            opt.put("series", seriesList.toArray());
        }
        if (tooltip != null) {
            opt.put("tooltip", tooltip);
        }

        if (xAxisList.size() > 0) {
            ArrayList<JSONObject> xAxisJOList = new ArrayList<JSONObject>();
            for (EChartsAxis eChartsAxis : xAxisList) {
                JSONObject axisJo = eChartsAxis.getAxisJO(this.getCatalogList());
                xAxisJOList.add(axisJo);
            }
            if (xAxisJOList.size() == 1) {
                opt.put("xAxis", xAxisJOList.get(0));
            } else {
                opt.put("xAxis", xAxisJOList.toArray());
            }
        }

        if (yAxisList.size() > 0) {
            ArrayList<JSONObject> yAxisJOList = new ArrayList<JSONObject>();
            for (EChartsAxis eChartsAxis : yAxisList) {
                JSONObject axisJo = eChartsAxis.getAxisJO(this.getCatalogList());
                yAxisJOList.add(axisJo);
            }
            if (yAxisJOList.size() == 1) {
                opt.put("yAxis", yAxisJOList.get(0));
            } else {
                opt.put("yAxis", yAxisJOList.toArray());
            }
        }
        return opt;

    }

    /**
     * 获取图表模型对象
     *
     * @return
     */
    public IChartModel getChartModel() {
        return this.iChartModel;
    }

    /**
     * 添加时间分类
     *
     * @param strTimeMode
     * @param dtBeginTime
     * @param dtEndTime
     * @throws Exception
     */
    public void addTimeCatalog(String strTimeMode, java.util.Date dtBeginTime, java.util.Date dtEndTime) throws Exception {
        if (dtBeginTime == null || dtEndTime == null) {
            throw new Exception("时间范围无效");
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(dtBeginTime);

        int nTimeGroup = timeGroupValueMap.get(strTimeMode);

        while (true) {
            String strCatalogName = getTimeCatalog(nTimeGroup, calendar);
            this.addCatalog(strCatalogName);

            if (calendar.getTime().getTime() >= dtEndTime.getTime()) break;

            // 添加时间
            switch (nTimeGroup) {
                case TIMEGROUP_YEAR:
                    calendar.add(Calendar.YEAR, 1);
                    break;
                case TIMEGROUP_QUARTER:
                    calendar.add(Calendar.MONTH, 3);
                    break;
                case TIMEGROUP_MONTH:
                    calendar.add(Calendar.MONTH, 1);
                    break;
                case TIMEGROUP_YEARWEEK:
                    calendar.add(Calendar.WEEK_OF_YEAR, 1);
                    break;
                case TIMEGROUP_DAY:
                    calendar.add(Calendar.DAY_OF_YEAR, 1);
                    break;
            }

        }
    }

    /**
     * 添加时间分类
     *
     * @param strTimeMode
     * @param dtTime
     * @return
     * @throws Exception
     */
    public String getTimeCatalog(String strTimeMode, java.util.Date dtTime) throws Exception {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(dtTime);
        return getTimeCatalog(timeGroupValueMap.get(strTimeMode), calendar);
    }

    /**
     * 添加时间分类
     *
     * @param nTimeMode
     * @param calendar
     * @return
     * @throws Exception
     */
    public String getTimeCatalog(int nTimeMode, Calendar calendar) throws Exception {
        // 添加时间
        switch (nTimeMode) {
            case TIMEGROUP_YEAR:
                return String.format("%s", calendar.get(Calendar.YEAR));
            case TIMEGROUP_QUARTER:
                int nMonth = calendar.get(Calendar.MONTH);
                return String.format("%s Q%s", calendar.get(Calendar.YEAR), (nMonth / 3) + 1);
            case TIMEGROUP_MONTH:
                return String.format("%s/%02d", calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1);
            case TIMEGROUP_YEARWEEK:
                return String.format("%s W%s", calendar.get(Calendar.YEAR), calendar.get(Calendar.WEEK_OF_YEAR));
            case TIMEGROUP_DAY:
                return String.format("%s/%02d/%02d", calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1, calendar.get(Calendar.DAY_OF_MONTH));
        }
        throw new Exception("无法获取时间分组内容");
    }
}
