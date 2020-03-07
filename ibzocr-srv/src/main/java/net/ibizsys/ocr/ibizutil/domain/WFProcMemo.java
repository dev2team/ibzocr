package net.ibizsys.ocr.ibizutil.domain;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Data
public class WFProcMemo {
    private List<ProcItem> procItems = new ArrayList<>();
    private String tmpMemo="";

    @Data
    public class ProcItem{
        private String wfstep="";
        private String wfactorid="";
        private String wfactorname="";
        @JsonFormat(pattern="yyyy-MM-dd HH:mm", locale = "zh" , timezone="GMT+8")
        private Timestamp wfproctime;
        private String memo="";
    }

    public WFProcMemo commit(Object wfstep,String wfactorid,String wfactorname)
    {
        if(wfstep==null)
            wfstep=wfactorname;
        ProcItem item=new ProcItem();
        item.setMemo(this.tmpMemo);
        item.setWfactorid(wfactorid);
        item.setWfactorname(wfactorname);
        item.setWfstep(wfstep.toString());
        item.setWfproctime(new Timestamp((new java.util.Date()).getTime()));
        this.procItems.add(item);
        this.tmpMemo="";
        return this;
    }

    public static WFProcMemo create(Object nr)
    {
        if(nr==null)
            return new WFProcMemo();
        return create(nr.toString());
    }

    public static WFProcMemo create(String nr)
    {
        if(StringUtils.isEmpty(nr))
            return new WFProcMemo();
        WFProcMemo wfProcMemo=JSONObject.parseObject(nr, WFProcMemo.class);
        return wfProcMemo;
    }

    public String getContent(boolean bOrder)
    {
        return JSONObject.toJSONString(this);
    }
}
