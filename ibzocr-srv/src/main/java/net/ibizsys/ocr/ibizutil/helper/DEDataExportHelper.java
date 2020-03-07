package net.ibizsys.ocr.ibizutil.helper;

import net.ibizsys.ocr.ibizutil.domain.IBZFILE;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import net.ibizsys.ocr.ibizutil.service.IBZFILEService;
import net.ibizsys.ocr.ibizutil.annotation.Dict;
import net.ibizsys.ocr.ibizutil.domain.CodeListBase;
import org.springframework.util.StringUtils;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.text.SimpleDateFormat;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 表格数据导出工具类
 */
public class DEDataExportHelper {

    private static DEDataExportHelper deDataExportHelper;
    /**
     * 获取导出对象实例
     * @return
     */
    public static DEDataExportHelper getInstance(){
        if(deDataExportHelper==null)
            deDataExportHelper=new DEDataExportHelper();
        return deDataExportHelper;
    }
    /**
     * 生成xls文件
     * @param strFile
     * @param colnums
     * @param datas
     * @throws IOException
     * @throws WriteException
     */
    public File output(String strFile, List<Map<String,String>> colnums, List<Map<String,Object>> datas , Map <String, Dict> DEDictFields  , Map <String, JsonFormat> DEDateFields) throws IOException, WriteException {
        File outputFile=new File(strFile);

        WritableWorkbook workbook = Workbook.createWorkbook(outputFile);
        WritableSheet s1 = workbook.createSheet("数据", 0);
        int nRowIndex = 0;
        int nColumnIndex = 0;
        //绘制excel列头
        for(Map<String,String> col:colnums){
            for (Map.Entry<String,String> entry : col.entrySet()) {
                String colLogicName=entry.getValue(); //列名-逻辑名称
                Label l = new Label(nColumnIndex, nRowIndex, colLogicName);
                s1.addCell(l);
                s1.setColumnView(nColumnIndex, 30);
                nColumnIndex++;
            }
        }
        nRowIndex++;
        nColumnIndex = 0;
        // 输出行数据
        for(Map<String,Object> rowdata:datas){
            for(Map<String,String> col:colnums){//按照列头顺序输出行数据
                for (Map.Entry<String,String> entry : col.entrySet()) {
                    String strObj="";
                    String strKey=entry.getKey();
                    Object rowobj =rowdata.get(strKey);
                    if(rowobj!=null)
                        strObj=rowobj.toString();
                    if(DEDictFields.containsKey(strKey)&& (!StringUtils.isEmpty(strObj))){//判断该字段是否为代码表
                        Dict dict=DEDictFields.get(strKey);
                        String dictName=dict.dictName();
                        strObj = CodeListBase.getCodeListText(dictName,strObj);//将值通过代码表进行转换
                    }
                    else if(DEDateFields.containsKey(strKey)&& (!StringUtils.isEmpty(strObj))){//判断该字段是否为时间类型
                        JsonFormat dateAnno=DEDateFields.get(strKey);
                        if(rowobj instanceof  Timestamp){//时间类型字段转换
                            Timestamp timestamp=(Timestamp)rowobj;
                            Date date=timestamp;
                            String dateFormat=dateAnno.pattern();
                            SimpleDateFormat format=new SimpleDateFormat(dateFormat);
                            strObj=format.format(date);//根据数据类型进行格式转换
                        }
                    }
                    Label l = new Label(nColumnIndex, nRowIndex, strObj);
                    s1.addCell(l);
                }
                nColumnIndex++;
            }
            nRowIndex++;
            nColumnIndex = 0;
        }
        workbook.write();
        workbook.close();
        return outputFile;
    }

    /**
     * 保存file表记录
     * @param
     * @param strLocalPath
     * @param fileid
     */
    public void saveFileData(File outputFile,String strLocalPath,String fileid,IBZFILEService ibzfileService){
        IBZFILE ibzfile = new IBZFILE();
        ibzfile.setFileid(fileid);
        ibzfile.setFilename(outputFile.getName());
        ibzfile.setFilepath(strLocalPath);
        ibzfile.setFileid(fileid);
        Integer nFileSize = 0;
        nFileSize = Integer.parseInt(outputFile.length() + "");
        ibzfile.setCreateman(AuthenticationUser.getAuthenticationUser().getUserid());
        ibzfile.setUpdateman(AuthenticationUser.getAuthenticationUser().getUserid());
        ibzfile.setCreatedate(new Timestamp(new Date().getTime()));
        ibzfile.setUpdatedate(new Timestamp(new Date().getTime()));
        ibzfileService.save(ibzfile);
    }
}
