
package net.ibizsys.ocr.ocr.rest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.validation.constraints.NotBlank;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.beans.BeanCopier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.service.OCRRecordService;
import net.ibizsys.ocr.ocr.service.dto.OCRRecordSearchFilter;
import net.ibizsys.ocr.ocr.vo.OCRRecord_EditForm_Main;
import net.ibizsys.ocr.ocr.vo.OCRRecord_Grid_Main;
import net.ibizsys.ocr.ocr.vo.OCRRecord_SearchForm_Default;

@RestController
public class OCRRecordController{

        @Autowired
        private OCRRecordService ocrrecordService;
        /**
         * 获取服务对象
        */
        protected OCRRecordService getService(){
            return this.ocrrecordService;
        }


        @PreAuthorize("hasPermission(#form.srfkey,'',{'OCRRecord','UPDATE',this.getEntity()})")
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maineditform/update")
        public ResponseEntity<OCRRecord_EditForm_Main> ocrwebmainEditFormUpdate(@Validated @RequestBody OCRRecord_EditForm_Main form){
            OCRRecord entity =form.toOCRRecord();
            this.getService().get(entity);//获取entity完整数据
            BeanCopier copier=BeanCopier.create(form.getClass(),entity.getClass(), false);//vo数据覆盖do数据
            copier.copy(form,entity,null);//执行覆盖操作
            getService().update(entity);
            form.fromOCRRecord(entity);
            form.setSrfuf("1");
            return ResponseEntity.ok().body(form);
        }
        @PreAuthorize("hasPermission(#srfkey,'',{'OCRRecord','DELETE',this.getEntity()})")
        @GetMapping(value="/ocrweb/ocr/ocrrecord/maineditform/remove")
        public ResponseEntity<OCRRecord_EditForm_Main> ocrwebmainEditFormRemove(@Validated @NotBlank(message = "srfkey不允许为空") @RequestParam("srfkey")String srfkey){
            OCRRecord_EditForm_Main form=new OCRRecord_EditForm_Main();
            OCRRecord entity = new OCRRecord();
            entity.setOcrrecordid(srfkey);
            getService().remove(entity);
            form.setSrfuf("0");
            form.fromOCRRecord(entity);
            return ResponseEntity.ok().body(form);
        }
        @PreAuthorize("hasPermission('','',{'OCRRecord','CREATE',this.getEntity()})")
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maineditform/getdraft")
        public ResponseEntity<OCRRecord_EditForm_Main> ocrwebmainEditFormGetDraft(@RequestBody OCRRecord_EditForm_Main form){
        if(!StringUtils.isEmpty(form.getSrfsourcekey()))
        {
            OCRRecord sourceEntity =new OCRRecord();
            sourceEntity.setOcrrecordid(form.getSrfsourcekey());
            this.getService().get(sourceEntity);

            OCRRecord targetEntity =new OCRRecord();
            sourceEntity.copyTo(targetEntity);
            form.fromOCRRecord(targetEntity,false);
            form.setSrfuf("0");
            return ResponseEntity.ok().body(form);
         }
            OCRRecord entity =form.toOCRRecord();
            getService().getDraft(entity);
            form.fromOCRRecord(entity);
            form.setSrfuf("0");
            return ResponseEntity.ok().body(form);
        }
        @PreAuthorize("hasPermission(#srfkey,'',{'OCRRecord','READ',this.getEntity()})")
        @GetMapping(value="/ocrweb/ocr/ocrrecord/maineditform/get")
        public ResponseEntity<OCRRecord_EditForm_Main> ocrwebmainEditFormGet(@Validated @NotBlank(message = "srfkey不允许为空") @RequestParam("srfkey")String srfkey){
            OCRRecord_EditForm_Main form=new OCRRecord_EditForm_Main();
            OCRRecord entity = new OCRRecord();
            entity.setOcrrecordid(srfkey);
            getService().get(entity);
            form.setSrfuf("1");
            form.fromOCRRecord(entity);
            return ResponseEntity.ok().body(form);
        }
        @PreAuthorize("hasPermission('','',{'OCRRecord','CREATE',this.getEntity()})")
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maineditform/create")
        public ResponseEntity<OCRRecord_EditForm_Main> ocrwebmainEditFormCreate(@Validated @RequestBody OCRRecord_EditForm_Main form){
            OCRRecord entity =form.toOCRRecord();
            getService().create(entity);
            form.fromOCRRecord(entity);
            form.setSrfuf("1");
            return ResponseEntity.ok().body(form);
        }
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maingrid/update")
        public OCRRecord ocrwebmainGridUpdate(@Validated OCRRecord mainItem){
            return mainItem;
        }
        @PreAuthorize("hasPermission('',{'OCRRecord','DELETE',this.getEntity(),#args})")
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maingrid/remove")
        public ResponseEntity<OCRRecord> ocrwebmainGridRemove(@Validated @RequestBody Map args){
            OCRRecord entity =new OCRRecord();
            if ( !StringUtils.isEmpty(args.get("srfkeys"))) {
                String srfkeys=args.get("srfkeys").toString();
                String srfkeyArr[] =srfkeys.split(";");
                for(String srfkey : srfkeyArr)
                {
                    if(!StringUtils.isEmpty(srfkey)){
                    entity.setOcrrecordid(srfkey);
                    this.getService().remove(entity);
                    }
                }
            }
            return ResponseEntity.ok().body(entity);
        }
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maingrid/getdraft")
        public OCRRecord ocrwebmainGridGetDraft(@Validated OCRRecord mainItem){
            return mainItem;
        }
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maingrid/create")
        public OCRRecord ocrwebmainGridCreate(@Validated OCRRecord mainItem){
            return mainItem;
        }
        @org.springframework.beans.factory.annotation.Value("${ibiz.filePath}")
        private String strFilePath;
        @Autowired
        private net.ibizsys.ocr.ibizutil.service.IBZFILEService ibzfileService;
        /**
         * [main]表格数据导出
         * @param searchFilter
         * @return
         * @throws IOException
         * @throws
         */
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maingrid/exportdata/searchdefault")
	    public ResponseEntity<Page<JSONObject>> maingridExportDataSearchDefault(@Validated @RequestBody OCRRecordSearchFilter searchFilter) throws IOException, jxl.write.WriteException {
            String fileid=com.baomidou.mybatisplus.core.toolkit.IdWorker.get32UUID();
            String localPath=ocrwebExportDataInit(fileid);//输出文件相对路径
            Page<OCRRecord> searchResult = this.getService().searchDefault(searchFilter);//1.查询表格数据
            List<Map<String,Object>> datas=OCRRecord_Grid_Main.getInstance().pageToListDatas(searchResult);//2.将数据转换成list
            List<Map<String,String>> colnums=OCRRecord_Grid_Main.getInstance().getGridColumnModels();//3.获取表格列头
            java.io.File outputFile=net.ibizsys.ocr.ibizutil.helper.DEDataExportHelper.getInstance().output(strFilePath+localPath,colnums,datas,new OCRRecord().getDictField(),new OCRRecord().getDateField());//4.生成导出文件
            net.ibizsys.ocr.ibizutil.helper.DEDataExportHelper.getInstance().saveFileData(outputFile,localPath,fileid,ibzfileService); //5.保存file表记录
            String strDownloadUrl =String.format("ibizutil/download/"+fileid);//6.回传文件路径给前台
            Page<JSONObject> resultObj=OCRRecord_Grid_Main.getInstance().getResultPage(searchResult,strDownloadUrl);//7.获取输出对象
                return ResponseEntity.ok().body(resultObj);
        }
        /**
         * 表格数据导出
         * @param fileid
         * @return
         */
        private String ocrwebExportDataInit(String fileid) {
            java.text.SimpleDateFormat dateFormat = new java.text.SimpleDateFormat("yyyyMMdd");
            String filepath=dateFormat.format(new java.util.Date())+ java.io.File.separator;
            java.text.SimpleDateFormat dateFormat2 = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
            String strTempFileName = fileid+"-"+dateFormat2.format(new java.util.Date())+".xls";
            java.io.File file =new java.io.File(strFilePath+filepath);
            if(!file.exists())
               file.mkdirs();
            return filepath+strTempFileName;
        }
        @PreAuthorize("hasPermission('',{'OCRRecord','DEFAULT','READ',this.getEntity(),#searchFilter})")
        @PostMapping(value="/ocrweb/ocr/ocrrecord/maingrid/searchdefault")
        public ResponseEntity<Page<OCRRecord_Grid_Main>> ocrwebmainGridSearchDefault(@Validated @RequestBody OCRRecordSearchFilter searchFilter){
                Page<OCRRecord> searchResult = this.getService().searchDefault(searchFilter);
                Page<OCRRecord_Grid_Main> searchResult_vo_data =OCRRecord_Grid_Main.getInstance().fromOCRRecord(searchResult);
                        return ResponseEntity.ok().body(searchResult_vo_data);
        }
        @PostMapping(value="/ocrweb/ocr/ocrrecord/defaultsearchform/load")
        public void ocrwebdefaultSearchFormLoad(){

        }
        @PostMapping(value="/ocrweb/ocr/ocrrecord/defaultsearchform/loaddraft")
        public ResponseEntity<OCRRecord_SearchForm_Default> ocrwebdefaultSearchFormLoadDraft(@RequestBody OCRRecord_SearchForm_Default searchform){
                OCRRecordSearchFilter searchfilter =searchform.toOCRRecordSearchFilter();
                searchform.fromOCRRecordSearchFilter(searchfilter);
                return ResponseEntity.ok().body(searchform);
        }
        @PostMapping(value="/ocrweb/ocr/ocrrecord/defaultsearchform/search")
        public void ocrwebdefaultSearchFormSearch(){

        }
	/**
	 * 用于权限校验
	 * @return
	 */
	public OCRRecord getEntity(){
		return new OCRRecord();
	}
 }

