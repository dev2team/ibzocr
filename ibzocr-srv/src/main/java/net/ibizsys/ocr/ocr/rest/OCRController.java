
package net.ibizsys.ocr.ocr.rest;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import net.ibizsys.ocr.dto.ImgItem;
import net.ibizsys.ocr.dto.OCRResult;
import net.ibizsys.ocr.ibizutil.errors.BadRequestAlertException;
import net.ibizsys.ocr.ibizutil.errors.InternalServerErrorException;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.service.OCRRecordService;
import net.ibizsys.ocr.ocr.service.OCRService;
import net.ibizsys.ocr.ocr.util.FileUtil;

@RestController
public class OCRController {

    @Autowired
    private OCRRecordService ocrrecordService;

    @Autowired
    private OCRService ocrService;

    @Value("${ibiz.ocr.FilePath:/app/ocr/}")
    private String OCRFILEPATH;

    @Value("${ibiz.filePath:/app/file/}")
    private String FILEPATH;

    @PreAuthorize("hasPermission(#form.srfkey,'',{'OCRRecord','UPDATE',this.getEntity()})")
    @PostMapping(value = "/ocr/ocrrecord/save")
    public ResponseEntity<OCRRecord> ocrSave(@Validated @RequestBody OCRRecord entity) {
        ocrrecordService.save(entity);
        return ResponseEntity.ok().body(entity);
    }

    @PreAuthorize("hasPermission(#srfkey,'',{'OCRRecord','READ',this.getEntity()})")
    @GetMapping(value = "/ocr/ocrrecord/{ocrrecordid}")
    public ResponseEntity<OCRRecord> ocrGet(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid) {
        return ResponseEntity.ok().body(ocrService.getById(ocrrecordid, true));
    }

    @PreAuthorize("hasPermission(#srfkey,'',{'OCRRecord','READ',this.getEntity()})")
    @GetMapping(value = "/ocr/result/{ocrrecordid}")
    public ResponseEntity<OCRResult> ocrResult(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid) {
        return ResponseEntity.ok().body(ocrService.getResultById(ocrrecordid));
    }


    @PostMapping(value = "/ocr/ocrrecord/{ocrrecordid}/upload")
    public ResponseEntity<List<ImgItem>> upload(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
            @RequestParam("file") MultipartFile multipartFile) {
        // 获取文件名
        String fileName = multipartFile.getOriginalFilename();
        if (!FileUtil.canOcr(fileName))
            throw new BadRequestAlertException("不是图片或pdf格式", fileName, "");
        // 获取文件后缀
        String extname = "." + FileUtil.getExtensionName(fileName);
        // 用uuid作为文件名，防止生成的临时文件重复
        String fileid = UUID.randomUUID().toString();
        fileName = fileid + extname;
        File file = null;
        List<ImgItem> rt =new ArrayList<>();
        try {
            File ocrdir = new File(OCRFILEPATH);
            if (!ocrdir.exists())
                ocrdir.mkdirs();
            file = new File(ocrdir, fileName);
            FileCopyUtils.copy(multipartFile.getInputStream(), Files.newOutputStream(file.toPath()));
            rt=ocrService.addFile(ocrrecordid, file);
        } catch (IOException e) {
            throw new InternalServerErrorException("文件上传失败");
        }
        return ResponseEntity.ok().body(rt);
    }

    @PostMapping(value = "/ocr/ocrrecord/{ocrrecordid}/orcimg")
    public ResponseEntity<ImgItem> orcimg(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
            @RequestBody ImgItem param) {
        return ResponseEntity.ok().body(ocrService.imgocr(ocrrecordid, param,true));
    }


    @PostMapping(value = "/ocr/ocrrecord/{ocrrecordid}/rotateimg/{rotate}")
    public ResponseEntity<ImgItem> rotateimg(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,@PathVariable("rotate") Integer rotate,
            @RequestBody ImgItem param) {
        return ResponseEntity.ok().body(ocrService.imgrotate(ocrrecordid, param,rotate));
    }

    @PostMapping(value = "/ocr/ocrrecord/{ocrrecordid}/deskewimg")
    public ResponseEntity<ImgItem> deskewimg(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
            @RequestBody ImgItem param) {
        return ResponseEntity.ok().body(ocrService.imgdeskew(ocrrecordid, param));
    }

    @PostMapping(value = "/ocr/ocrrecord/{ocrrecordid}/normalizeimg")
    public ResponseEntity<ImgItem> normalizeimg(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
            @RequestBody ImgItem param) {
        return ResponseEntity.ok().body(ocrService.imgnormalize(ocrrecordid, param));
    }

    @PostMapping(value = "/ocr/ocrrecord/{ocrrecordid}/removered")
    public ResponseEntity<ImgItem> removered(
            @Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
            @RequestBody ImgItem param) {
        return ResponseEntity.ok().body(ocrService.removered(ocrrecordid, param));
    }


    @PostMapping(value = "/ocr/{ocrrecordid}")
    public ResponseEntity<OCRResult> ocr(@Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid, @RequestBody ImgItem param) {
        OCRResult result=new OCRResult();
        result.setOcrrecordid(ocrrecordid);
        OCRRecord record=ocrService.getById(ocrrecordid,false);
        boolean removeWhenSuss=false;
        if(!"succ".equals(record.getProcstate()))
        {
            List<ImgItem> list=record.getImgItems();
            File src= null;
            if(list.size()==0)
            {
                if(StringUtils.isEmpty(param.getImg()))
                    throw new BadRequestAlertException("输入参数缺少文件路径", "ocr", "");
                if (!FileUtil.canOcr(param.getImg()))
                    throw new BadRequestAlertException("不是图片或pdf格式", param.getImg(), "");
                src=new File(FILEPATH,param.getImg().replace("\\",File.separator).replace("/",File.separator));
                if(!src.exists())
                {
                    if(StringUtils.isEmpty(param.getImg()))
                        throw new BadRequestAlertException("输入参数缺少文件Base64内容", "ocr", "");
                    String extname = "." + FileUtil.getExtensionName(param.getImg());
                    String fileName = ocrrecordid + extname;
                    File ocrdir = new File(OCRFILEPATH);
                    if (!ocrdir.exists())
                        ocrdir.mkdirs();
                    src = new File(ocrdir, fileName);
                    OCRService.base64ToFile(src,param.getBase64());
                    if(!src.exists())
                        throw new BadRequestAlertException("Base64反序列化文件失败", "ocr", "");
                    if(extname.equalsIgnoreCase(".pdf"))
                        removeWhenSuss=true;
                }

                try
                {
                    list=ocrService.addFile(ocrrecordid,src);
                }
                catch (Exception ex)
                {
                    throw new InternalServerErrorException("文件上传失败");
                }
            }

            if(list.size()>0)
            {
                if (param.getOcrState() == 0)
                {
                    batchOcr(list, record);
                }
                else //不直接识别，暂缓进队列给使用方传递文件并预览
                {
                    for (ImgItem item : list)
                    {
                        record.putImgItem(item);
                    }
                    record.getOcrrecordname();
                    ocrrecordService.save(record);
                }
            }

            if(removeWhenSuss&&"succ".equalsIgnoreCase(record.getProcstate())&&src!=null&&src.exists())
                src.delete();
        }
        result.setImgItems(record.getImgItems());
        result.setContent(record.getContent());
        result.setTitle(record.getOcrrecordname());
        result.setProcstate(record.getProcstate());
        return ResponseEntity.ok().body(result);
    }


    @PreAuthorize("hasPermission(#srfkey,'',{'OCRRecord','READ',this.getEntity()})")
    @RequestMapping(value = "/ocr/view", method = RequestMethod.GET)
    public ResponseEntity ocrView(
            @Validated @NotBlank(message = "url不允许为空") @RequestParam("url") String url,@RequestParam(value="fullfilename",required=false) String fullfilename) {
        String ocrrecordid=ocrService.getByUrl(url,fullfilename,true).getOcrrecordid();
        return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).header(HttpHeaders.LOCATION, "../#/ocr_index/"+ocrrecordid+"/ocr_ocrrecordocrview").build();
    }


    @PreAuthorize("hasPermission(#srfkey,'',{'OCRRecord','READ',this.getEntity()})")
    @RequestMapping(value = "/ocr/pdfview", method = RequestMethod.GET)
    public ResponseEntity ocrPdffView(
            @Validated @NotBlank(message = "url不允许为空") @RequestParam("url") String url,@RequestParam(value="fullfilename",required=false) String fullfilename) {
        OCRRecord record=ocrService.getByUrl(url,fullfilename,false);
        if(!"succ".equals(record.getProcstate())) {
            List<ImgItem> list=record.getImgItems();
            if(list.size()>0) {
                batchOcr(list,record);
            }
        }
        return ResponseEntity.status(HttpStatus.MOVED_PERMANENTLY).header(HttpHeaders.LOCATION, "../ocr/ocrrecord/ocrFile/previewPDF/"+record.getOcrrecordid()).build();
    }

    private void batchOcr( List<ImgItem> list,OCRRecord record)
    {
        List<CompletableFuture<ImgItem> > futures=new ArrayList<>();
        for(ImgItem item:list)
        {
            CompletableFuture<ImgItem> comp= ocrService.imgocrAsync(item);
            futures.add(comp);
        }
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[]{})).join();
        for(CompletableFuture<ImgItem> comp:futures)
        {
            try {
                record.putImgItem(comp.get());
            } catch (InterruptedException e) {
                throw new InternalServerErrorException("文件识别失败");
            } catch (ExecutionException e) {
                throw new InternalServerErrorException("文件识别失败");
            }
        }
        record.getOcrrecordname();
        ocrrecordService.save(record);
    }


}
