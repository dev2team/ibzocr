package net.ibizsys.ocr.ocr.vo;

import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.Data;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import org.springframework.cglib.beans.BeanMap;
import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.domain.VOBase;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OCRRecord_Grid_Main{

    private static OCRRecord_Grid_Main ocrrecord_grid_main;
    public static OCRRecord_Grid_Main getInstance(){
        if(ocrrecord_grid_main==null)
        ocrrecord_grid_main = new OCRRecord_Grid_Main();
        return ocrrecord_grid_main;
    }

    private String procstate;
    private String ocrrecordid;
    private String ocrrecordname;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale = "zh" , timezone="GMT+8")
    private Timestamp updatedate;
    private String srfmajortext;
    private String srfdataaccaction;
    private String srfkey;
    public void fromOCRRecord(OCRRecord sourceEntity)  {
         this.setProcstate(sourceEntity.getProcstate());
         this.setOcrrecordid(sourceEntity.getOcrrecordid());
         this.setOcrrecordname(sourceEntity.getOcrrecordname());
         this.setUpdatedate(sourceEntity.getUpdatedate());
         this.setSrfmajortext(sourceEntity.getOcrrecordname());
         this.setSrfdataaccaction(sourceEntity.getOcrrecordid());
         this.setSrfkey(sourceEntity.getOcrrecordid());
	}
	public Page<OCRRecord_Grid_Main> fromOCRRecord(Page<OCRRecord> sourcePage)  {
        if(sourcePage==null)
            return null;
        Page<OCRRecord_Grid_Main> targetpage=new Page<OCRRecord_Grid_Main>(sourcePage.getCurrent(),sourcePage.getSize(),sourcePage.getTotal(),sourcePage.isSearchCount());
        List<OCRRecord_Grid_Main> records=new ArrayList<OCRRecord_Grid_Main>();
        for(OCRRecord source:sourcePage.getRecords()) {
            OCRRecord_Grid_Main target=new OCRRecord_Grid_Main();
            target.fromOCRRecord(source);
            records.add(target);
        }
        targetpage.setAsc(sourcePage.ascs());
        targetpage.setDesc(sourcePage.descs());
        targetpage.setOptimizeCountSql(sourcePage.optimizeCountSql());
        targetpage.setRecords(records);
        return targetpage;
    }
    /**
     * 表格模型集合
     * @return
     */
    public  List<Map<String,String>> getGridColumnModels() {
        List columnModelList =new ArrayList();
        columnModelList.add(new HashMap(){ { put("ocrrecordid","识别记录标识"); }});
        columnModelList.add(new HashMap(){ { put("ocrrecordname","识别记录名称"); }});
        columnModelList.add(new HashMap(){ { put("procstate","处理状态"); }});
        columnModelList.add(new HashMap(){ { put("updatedate","更新时间"); }});
        return columnModelList;
    }
    /**
     *将entity转成map
     * @param bean
     * @param <T>
     * @return
     */
    public <T> Map<String,Object> beanToMap(T bean){
        Map map =new HashMap<String,Object>();
        if(bean!=null){
            BeanMap beanMap=BeanMap.create(bean);
            for(Object obj:beanMap.keySet()){
                map.put(obj+"",beanMap.get(obj));
            }
        }
        return map;
    }
    /**
     * 将entity转成map
     * @param searchResult
     * @return
     */
    public  List<Map<String, Object>> pageToListDatas(Page<OCRRecord> searchResult) {
        if(searchResult==null)
            return null;
        List<Map<String, Object>> records=new ArrayList<>();
        for(OCRRecord source:searchResult.getRecords()) {
            OCRRecord_Grid_Main target=new OCRRecord_Grid_Main();
            records.add(target.beanToMap(source));
        }
        return records;
    }
    /**
     * 输出表格数据导出文件url
     * @param sourcePage
     * @param downloadurl
     * @return
     */
    public Page<JSONObject> getResultPage(Page<OCRRecord> sourcePage,String downloadurl)  {
        if(sourcePage==null)
            return null;
        Page<JSONObject> targetpage=new Page<JSONObject>(sourcePage.getCurrent(),sourcePage.getSize(),sourcePage.getTotal(),sourcePage.isSearchCount());
        List<JSONObject> records=new ArrayList<JSONObject>();
        JSONObject obj =new JSONObject();
        obj.put("downloadurl",downloadurl);
        records.add(obj);
        targetpage.setAsc(sourcePage.ascs());
        targetpage.setDesc(sourcePage.descs());
        targetpage.setOptimizeCountSql(sourcePage.optimizeCountSql());
        targetpage.setRecords(records);
        return targetpage;
    }
}