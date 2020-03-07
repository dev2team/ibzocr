package net.ibizsys.ocr.ibizutil.vo;

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
import net.ibizsys.ocr.ibizutil.domain.Worklist;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import org.springframework.cglib.beans.BeanMap;
import com.alibaba.fastjson.JSONObject;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Worklist_Grid_Main{
    private String businesskey;
    private String starttime;
    private String startusername;
    private String workflowid;
    private String srfmajortext;


    private String srfdataaccaction;


    private String srfkey;


    private String step;
    private String workflowname;
    public  void fromWorklist(Worklist sourceEntity)  {
         this.setBusinesskey(sourceEntity.getBusinesskey());
         this.setStarttime(sourceEntity.getStarttime());
         this.setStartusername(sourceEntity.getStartusername());
         this.setWorkflowid(sourceEntity.getWorkflowid());
         this.setSrfmajortext(sourceEntity.getWorklistname());
         this.setSrfdataaccaction(sourceEntity.getWorklistid());
         this.setSrfkey(sourceEntity.getWorklistid());
         this.setStep(sourceEntity.getStep());
         this.setWorkflowname(sourceEntity.getWorkflowname());
	}

	public static Page<Worklist_Grid_Main> fromWorklist(Page<Worklist> sourcePage)  {
        if(sourcePage==null)
            return null;
        Page<Worklist_Grid_Main> targetpage=new Page<Worklist_Grid_Main>(sourcePage.getCurrent(),sourcePage.getSize(),sourcePage.getTotal(),sourcePage.isSearchCount());
        List<Worklist_Grid_Main> records=new ArrayList<Worklist_Grid_Main>();
        for(Worklist source:sourcePage.getRecords()) {
            Worklist_Grid_Main target=new Worklist_Grid_Main();
            target.fromWorklist(source);
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
    public static List<Map<String,String>> getGridColumnModels() {
        List columnModelList =new ArrayList();
        columnModelList.add(new HashMap(){ { put("startusername","发起人"); }});
        columnModelList.add(new HashMap(){ { put("starttime","发起时间"); }});
        columnModelList.add(new HashMap(){ { put("workflowname","流程"); }});
        columnModelList.add(new HashMap(){ { put("step","流程步骤"); }});
        columnModelList.add(new HashMap(){ { put("workflowid","流程标识"); }});
        columnModelList.add(new HashMap(){ { put("businesskey","业务Key"); }});
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
    public static List<Map<String, Object>> pageToListDatas(Page<Worklist> searchResult) {
        if(searchResult==null)
            return null;
        List<Map<String, Object>> records=new ArrayList<>();
        for(Worklist source:searchResult.getRecords()) {
            Worklist_Grid_Main target=new Worklist_Grid_Main();
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
    public static Page<JSONObject> getResultPage(Page<Worklist> sourcePage,String downloadurl)  {
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
