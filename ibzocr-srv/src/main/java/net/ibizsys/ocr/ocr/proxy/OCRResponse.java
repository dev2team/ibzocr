package net.ibizsys.ocr.ocr.proxy;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import net.ibizsys.ocr.dto.TextBox;
import net.ibizsys.ocr.dto.TextLine;
import org.springframework.util.StringUtils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OCRResponse implements Serializable {

    private int ret;
    private String info;
    private String listtext;

    private String title;

    private List<Item> list;

    public String getTitle()
    {
        if(StringUtils.isEmpty(title))
        {
            if(list!=null&&list.size()>0)
            {
                for(Item item:list)
                {
                    if((!StringUtils.isEmpty(item.getSectionContent()))&&(!StringUtils.isEmpty(item.getTitle())))
                    {
                        title = item.getTitle();
                        break;
                    }
                }

            }
        }

        return title;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class  Item implements Serializable
    {
        public Item()
        {

        }
        private List<TextBox> res=new ArrayList<TextBox>();
        private List<TextLine> result=new ArrayList<TextLine>();
        private String content="";
        private Double timetake=-1d;
        private int angle=0;
        private String title;

        private String sectionContent="";
        public String getSectionContent()
        {
            try
            {
                if(res.size()>0&&(StringUtils.isEmpty(sectionContent)))
                {
                    float w1=0;
                    float r1=0;
                    float l1=0;
                    float w2=0;
                    float r2=0;
                    float l2=0;
                    for(TextBox tb:res) {
                        float r=(float)tb.getBox().get(2);
                        float l=(float)tb.getBox().get(0);
                        float w=r-l;
                        if(r>r1)
                            r1=r;

                        if(l1==0)
                            l1=r1;

                        if(l<l1)
                            l1=l;

                        if(w>w1)
                            w1=w;

                    }

                    for(TextBox tb:res) {
                        float r=(float)tb.getBox().get(2);
                        float l=(float)tb.getBox().get(0);
                        float w=r-l;
                        if(r<r1&&r>r2)
                            r2=r;
                        if(l2==0)
                            l2=r1;

                        if(l>l1&&l<l2)
                            l2=l;
                        if (w<w1&&w>w2)
                            w2=w;
                    }

                    if(w2!=0)
                        w1=(w1+w2)/2;
                    if(r2!=0)
                        r1=(r1+r2)/2;
                    if(l2!=0)
                        l1=(l1+l2)/2;

                    float titlew=0;
                    float titleh=0;

                    float lastW=w1;float lastR=r1;float lastL=l1;
                    String lastText="";
                    String sp="\r\n";
                    int i=0;
                    for(TextBox tb:res) {
                        float r = (float)tb.getBox().get(2);
                        float l = (float)tb.getBox().get(0);
                        float w = r - l;
                        float h = (float)tb.getBox().get(5)-(float)tb.getBox().get(1);


                        if(StringUtils.isEmpty(sectionContent))
                            sp="";
                        else
                            sp="\r\n";

                        if(lastW<(w1*0.75))//上一行不到平均行宽的2/3，判定为分段换行
                        {
                            sectionContent=sectionContent+sp;
                        }
                        else if((l-l1)>h*1.2) //有缩进
                        {
                            if(lastR<(r1-h*3))//本行有缩进，上一行行尾不满格，判定为分段换行
                            {
                                sectionContent=sectionContent+sp;
                            }
                            else if(sectionContent.endsWith(".")||sectionContent.endsWith("。")||
                                    sectionContent.endsWith("?")||sectionContent.endsWith("!")||
                                    sectionContent.endsWith("？")||sectionContent.endsWith("！"))//本行有缩进，上一行满格但是结尾为句号/问号/感叹号，也判定为分段换行
                            {
                                sectionContent=sectionContent+sp;
                            }
                        }
                        else if((!StringUtils.isEmpty(tb.getText()))&&
                                (tb.getText().startsWith("问:")||tb.getText().startsWith("答:")||
                                        tb.getText().startsWith("问：")||tb.getText().startsWith("答：")))//本行以问或答开头，判定为询问讯问笔录，分段换行
                        {
                            sectionContent=sectionContent+sp;
                        }
                        lastR=r;
                        lastL=l;
                        lastW=w;

                        //有缩进，大于两个字，宽度小于平均宽度2/3，行高最高的，结尾没有句号，视作标题
                        if(i<=3&&w<(w1*0.66)&&(l-l1)>h*3
                                && (!StringUtils.isEmpty(tb.getText()))&&tb.getText().length()>2
                                && (!tb.getText().endsWith("."))&&(!tb.getText().endsWith("。"))
                                && (!tb.getText().endsWith("?"))&&(!tb.getText().endsWith("？")))
                        {
                            if(h>titleh)
                            {
                                titlew=w;
                                titleh=h;
                                this.title=tb.getText().replace(" ","").replace("　","");
                            }
                            else if(!StringUtils.isEmpty(this.title))
                            {
                                String exp=".*(书|命令|决定|决议|指示|公告|布告|通告|通知|通报|报告|请示|批复|函|建议|意见|回执|说明|纪要|令|表|证)$";
                                if((!this.title.matches(exp))&&(tb.getText().matches(exp)))
                                {
                                    titlew=w;
                                    titleh=h;
                                    this.title=tb.getText().replace(" ","").replace("　","");

                                }
                            }


                        }
                        sectionContent=sectionContent+tb.getText();
                        i++;
                    }
                    if(lastW<(w1*0.66))
                        sectionContent=sectionContent+sp;


                }
            }
            catch (Exception ex)
            {
                sectionContent=this.content;
            }

            return sectionContent;
        }
    }

}
