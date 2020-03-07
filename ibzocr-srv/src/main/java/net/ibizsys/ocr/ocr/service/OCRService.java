package net.ibizsys.ocr.ocr.service;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import lombok.extern.slf4j.Slf4j;
import net.ibizsys.ocr.dto.OCRResult;
import net.ibizsys.ocr.ibizutil.errors.BadRequestAlertException;
import net.ibizsys.ocr.ibizutil.errors.InternalServerErrorException;
import net.ibizsys.ocr.dto.ImgItem;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.proxy.OCRClient;
import net.ibizsys.ocr.ocr.proxy.OCRResponse;
import net.ibizsys.ocr.ocr.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
public class OCRService {

    @Value("${ibiz.ocr.Mode:base64}")
    private String OCRMODE;
    @Value("${ibiz.ocr.FilePath:/app/ocr/}")
    private String OCRFILEPATH;
    @Value("${ibiz.pdfConvert:convert}")
    private String PDFCONVERTCMD;
    @Value("${ibiz.imgResize:600}")
    private Integer IMGRESIZE;
    @Value("${ibiz.pdfConvertParam:-quality 90 -density 120}")
    private String PDFCONVERTCMDPARAM;

    @Value("${ibiz.ocr.Resize:1}")
    private Integer ocrResize;

    @Autowired
    private OCRRecordService ocrrecordService;

    @Autowired
    private OCRClient ocrClient;

    @Async("asyncOcrExecutor")
    public CompletableFuture<ImgItem> imgocrAsync(ImgItem param)
    {
        log.debug("asyncOcr begin:"+param.getImg());

        ImgItem rt=imgocr("",param,false);
        log.debug("asyncOcr end:"+param.getImg());
        return CompletableFuture.completedFuture(rt);
    }

    @Async("asyncOcrExecutor")
    public CompletableFuture<ImgItem> imgocrAsync(String ocrrecordid,ImgItem param,boolean autoSave)
    {
        log.debug("asyncOcr begin:"+param.getImg());

        ImgItem rt=imgocr(ocrrecordid,param,autoSave);
        log.debug("asyncOcr end:"+param.getImg());
        return CompletableFuture.completedFuture(rt);
    }

    public ImgItem imgocr(String ocrrecordid,ImgItem param,boolean autoSave)
    {
        ImgItem rt=new ImgItem();
        rt.setImg(param.getImg());
        rt.setWidth(param.getWidth());
        rt.setHeight(param.getHeight());
        try
        {
            OCRResponse response=this.ocr(param);
            if(response!=null)
            {
                rt.setRes(response.getList().get(0).getRes());
                rt.setContent(response.getList().get(0).getSectionContent());
                rt.setTitle(response.getList().get(0).getTitle());
                rt.setTimetake(response.getList().get(0).getTimetake());
                rt.setBase64(null);
                rt.setOcrState(1);


                int angle=response.getList().get(0).getAngle();
                if(angle!=0)
                {
                    if(autoSave)
                        this.imgrotate(ocrrecordid,rt,angle*-1);
                    else
                        this.imgrotate(rt,angle*-1);
                }
                else
                {
                    if(autoSave)
                        this.refresh(ocrrecordid,rt,false);
                }
            }
        } catch (Exception ex)
        {
            rt.setContent(ex.getMessage());
            rt.setOcrState(-1);
        }
        return rt;
    }

    private OCRResponse ocr(ImgItem param) throws Exception
    {
        if(StringUtils.isEmpty(param.getImg()))
            throw new BadRequestAlertException("输入参数缺少图片名称","imgocr","");

        OCRResponse response=null;
        if(OCRMODE.equals("base64"))
        {
            if(StringUtils.isEmpty(param.getBase64()))
            {
                File file=new File(OCRFILEPATH,param.getImg());
                if(!file.exists())
                    throw new BadRequestAlertException("未找到图片文件","imgocr",param.getImg());
                param.setBase64(encodeBase64File(file));
            }
            response=ocrClient.ocrByImgBase64(param.getImg(),param.getBase64());
        }
        else
        {
            File file=new File(OCRFILEPATH,param.getImg());
            if(!file.exists())
                throw new BadRequestAlertException("未找到图片文件","imgocr",param.getImg());
            response=ocrClient.ocrByImgPath(file.getPath());
        }
        if(response==null)
        {
            throw new InternalServerErrorException("ocr识别失败,引擎接口返回为空："+param.getImg());
        }
        else if(response.getRet()!=0)
        {
            throw new InternalServerErrorException("ocr识别失败,引擎接口返回错误："+param.getImg()+response.getInfo());
        }
        else if(ObjectUtils.isEmpty(response.getList()))
        {
            throw new InternalServerErrorException("ocr识别失败,引擎接口返回List为空："+param.getImg());
        }
        else
        {

        }

        return response;
    }


    public OCRRecord getById(String ocrrecordid,boolean bFillContent) {
        OCRRecord entity = ocrrecordService.getById(ocrrecordid);
        if (entity == null) {
            entity = new OCRRecord();
            entity.setOcrrecordid(ocrrecordid);
            entity.setOcrrecordname(IdWorker.getIdStr());
        }

        if(bFillContent)
        {
            List<ImgItem> imgItems=entity.getImgItems();
            for(ImgItem item:imgItems)
            {
                if(StringUtils.isEmpty(item.getBase64()))
                {
                    File file=new File(OCRFILEPATH,item.getImg());
                    if(file.exists())
                    {
                        item.setBase64(encodeBase64File(file));
                    }
                }
            }
        }

        return entity;
    }

    public OCRResult getResultById(String ocrrecordid)
    {
        OCRResult result=new OCRResult();
        result.setOcrrecordid(ocrrecordid);
        OCRRecord entity = ocrrecordService.getById(ocrrecordid);
        if (entity == null)
        {
            result.setImgItems(new ArrayList<ImgItem>());
            result.setProcstate("notexists");
        }
        else
        {
            result.setImgItems(entity.getImgItems());
            result.setContent(entity.getContent());
            result.setTitle(entity.getOcrrecordname());
            result.setProcstate(entity.getProcstate());
        }
        return result;
    }

    public List<ImgItem> addFile(String ocrrecordid,File file) throws IOException
    {
        List<ImgItem> uploadImgItems = new ArrayList<>();
        if(file==null)
            return uploadImgItems;
        OCRRecord entity = getById(ocrrecordid,false);
        String fileName=file.getName();
        String fileid=fileName.split("[.]")[0];
        if (fileName.toLowerCase().endsWith(".pdf")) {
            // pdf切分，逐页img都add到list里

            File dirPdf=new File(OCRFILEPATH+fileid);
            dirPdf.mkdirs();

            String shell=PDFCONVERTCMD+" "+PDFCONVERTCMDPARAM+" "+file.getPath()+" "+OCRFILEPATH+fileid+ File.separator+fileid+".jpg";

            try
            {
                Runtime run = Runtime.getRuntime();
                Process p = run.exec(shell);                  //执行CMD命令
                if (p.waitFor() != 0) {

                }
                dirPdf.list();
                List<File> pages=listPageFiles(fileid,dirPdf);
                for(File page:pages)
                {
                    File newpage=new File(OCRFILEPATH,page.getName());
                    page.renameTo(newpage);
                    ImgItem item = new ImgItem();
                    item.setImg(newpage.getName());

                    calcSize(item,newpage);
                    uploadImgItems.add(item);
                }


                dirPdf.delete();
            }
            catch (Exception ex)
            {

            }

            //
            // for(==>){uploadImgItems.add(item);}
        } else {
            ImgItem item = new ImgItem();
            item.setImg(fileName);

            File newpage=new File(OCRFILEPATH,file.getName());
            if((!newpage.getPath().equals(file.getPath()))&&(!newpage.exists())&&file.exists())
                Files.copy(file.toPath(),newpage.toPath());
            calcSize(item,newpage);
            uploadImgItems.add(item);
        }

        for (ImgItem item : uploadImgItems) {
            entity.putImgItem(item);
        }
        ocrrecordService.save(entity);
        return uploadImgItems;
    }

    private void calcSize(ImgItem item,File img)
    {
        try
        {

            int width=0;
            int height=0;
            BufferedReader br = null;
            Runtime run = Runtime.getRuntime();
            try {
                Process p = run.exec("identify  -format %[fx:w]x%[fx:h] "+img.getPath());
                br = new BufferedReader(new InputStreamReader(p.getInputStream()));
                String line = null;
                StringBuilder sb = new StringBuilder();
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                }
                String strSize=(sb.toString());
                String[] arr=strSize.split("x");
                if(arr.length==2)
                {
                    width=Integer.parseInt(arr[0]);
                    height=Integer.parseInt(arr[1]);

                }

            } catch (Exception e) {

            }
            finally
            {
                if (br != null)
                {
                    try {
                        br.close();
                    } catch (Exception e) {
                    }
                }
            }

            if(width==0||height==0)
            {
                BufferedImage image = ImageIO.read(new FileInputStream(img));
                width=(image.getWidth());
                height=(image.getHeight());
                item.setWidth(width);
                item.setHeight(height);
            }


            if(ocrResize==1) {
                if (width < IMGRESIZE && height < IMGRESIZE) {
                    return;
                }
                String shell = PDFCONVERTCMD+" " + img.getPath() + " -resize " + IMGRESIZE + " " + img.getPath();

                if (width > height) {
                    shell = PDFCONVERTCMD+" " + img.getPath() + " -resize x" + IMGRESIZE + " " + img.getPath();
                    float n = (float) IMGRESIZE / (float) height;
                    item.setWidth((int) ((float) width * n));
                    item.setHeight(IMGRESIZE);
                } else {
                    float n = (float) IMGRESIZE / (float) width;

                    item.setWidth(IMGRESIZE);
                    item.setHeight((int) ((float) height * n));
                }

                Process p = run.exec(shell);                  //执行CMD命令
                if (p.waitFor() != 0) {

                }
                item.setBase64(encodeBase64File(new File(img.getPath())));
            }
            else
            {
                item.setWidth(width);
                item.setHeight(height);
                item.setBase64(encodeBase64File(img));
            }

        }
        catch(Exception ex)
        {

        }

    }

    public static String encodeBase64File(File file) {
        try {
            FileInputStream inputFile = new FileInputStream(file);
            byte[] buffer = new byte[(int) file.length()];
            inputFile.read(buffer);
            inputFile.close();
            java.util.Base64.Encoder encoder = java.util.Base64.getEncoder();
            return encoder.encodeToString(buffer);
        } catch (Exception ex) {
            return "";
        }
    }

    public static void base64ToFile(File file,String base64) {
        BufferedOutputStream bos = null;
        java.io.FileOutputStream fos = null;
        try {
            byte[] bytes = Base64.getDecoder().decode(base64);
            fos = new java.io.FileOutputStream(file);
            bos = new BufferedOutputStream(fos);
            bos.write(bytes);
        } catch (Exception e) {

        } finally {
            if (bos != null) {
                try {
                    bos.close();
                } catch (IOException e) {

                }
            }
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {

                }
            }
        }
    }

    public  List<File> listPageFiles(String fileid,File dirPdf) {
        List<File> pages = Arrays.asList(dirPdf.listFiles());
        Collections.sort(pages, new Comparator<File>(){
            public int compare(File o1, File o2) {
                if(o1.isDirectory() && o2.isFile())
                    return -1;
                if(o1.isFile() && o2.isDirectory())
                    return 1;

                int o1no=0;
                if(o1.getName().startsWith(fileid+"-"))
                    o1no=Integer.parseInt(o1.getName().replace(fileid+"-","").replace(".jpg",""));
                int o2no=0;
                if(o2.getName().startsWith(fileid+"-"))
                    o2no=Integer.parseInt(o2.getName().replace(fileid+"-","").replace(".jpg",""));

                return o1no-o2no;
            }
        });
        return pages;
    }

    @Async
    public  ImgItem refreshRecord(String ocrrecordid, ImgItem imgItem)
    {
        return this.refresh(ocrrecordid,imgItem,false);
    }

    private synchronized ImgItem refresh(String ocrrecordid, ImgItem imgItem ,boolean bRotate) {

        OCRRecord ocrRecord = ocrrecordService.getById(ocrrecordid);
        ocrRecord.putImgItem(imgItem);

        if(bRotate)
        {
            int width=imgItem.getWidth();
            int height=imgItem.getHeight();
            imgItem.setHeight(width);
            imgItem.setWidth(height);
            ocrRecord.putImgItem(imgItem);
        }

        ocrRecord.getProcstate();
        ocrRecord.getOcrrecordname();
        ocrrecordService.update(ocrRecord);
        return imgItem;
    }

    public ImgItem imgrotate(ImgItem param,Integer rotate) {
        if (StringUtils.isEmpty(param.getImg()))
            throw new BadRequestAlertException("输入参数缺少图片名称", "imgrotate", "");
        Runtime run = Runtime.getRuntime();
        try
        {
            File img=new File(OCRFILEPATH,param.getImg());
            String shell = PDFCONVERTCMD+" -rotate "+rotate+" " + img.getPath()+ " " + img.getPath();

            Process p = run.exec(shell);                  //执行CMD命令
            if (p.waitFor() != 0) {

            }
            if(rotate!=180&&rotate!=-180)
            {
                int width=param.getWidth();
                int height=param.getHeight();
                param.setHeight(width);
                param.setWidth(height);
            }
        }
        catch (Exception ex)
        {

        }


        return param;
    }


    public ImgItem imgrotate(String ocrrecordid,ImgItem param,Integer rotate) {
        if (StringUtils.isEmpty(param.getImg()))
            throw new BadRequestAlertException("输入参数缺少图片名称", "imgrotate", "");
        Runtime run = Runtime.getRuntime();
        try
        {
            File img=new File(OCRFILEPATH,param.getImg());
            String shell = PDFCONVERTCMD+" -rotate "+rotate+" " + img.getPath()+ " " + img.getPath();

            Process p = run.exec(shell);                  //执行CMD命令
            if (p.waitFor() != 0) {

            }
            if(rotate!=180&&rotate!=-180)
            {

                this.refresh(ocrrecordid,param,true);
            }
            else
            {
                this.refresh(ocrrecordid,param,false);
            }


            param.setBase64(encodeBase64File(new File(img.getPath())));
        }
        catch (Exception ex)
        {

        }


        return param;
    }


    public ImgItem imgdeskew(String ocrrecordid,ImgItem param) {
        if (StringUtils.isEmpty(param.getImg()))
            throw new BadRequestAlertException("输入参数缺少图片名称", "imgdeskew", "");
        Runtime run = Runtime.getRuntime();
        try
        {
            File img=new File(OCRFILEPATH,param.getImg());
            String shell = PDFCONVERTCMD+" " + img.getPath()+ " -background white -deskew 40% " + img.getPath();

            Process p = run.exec(shell);                  //执行CMD命令
            if (p.waitFor() != 0) {

            }

            calcSize(param,img);
            this.refresh(ocrrecordid,param,false);


        }
        catch (Exception ex)
        {

        }


        return param;
    }

    public ImgItem imgnormalize(String ocrrecordid,ImgItem param) {
        if (StringUtils.isEmpty(param.getImg()))
            throw new BadRequestAlertException("输入参数缺少图片名称", "normalize", "");
        Runtime run = Runtime.getRuntime();
        try
        {
            File img=new File(OCRFILEPATH,param.getImg());
            String shell = PDFCONVERTCMD+" " + img.getPath()+ " -normalize " + img.getPath();

            Process p = run.exec(shell);                  //执行CMD命令
            if (p.waitFor() != 0) {

            }

            calcSize(param,img);
            this.refresh(ocrrecordid,param,false);


        }
        catch (Exception ex)
        {

        }


        return param;
    }

    public ImgItem removered(String ocrrecordid,ImgItem param) {
        if (StringUtils.isEmpty(param.getImg()))
            throw new BadRequestAlertException("输入参数缺少图片名称", "removered", "");

        if (!OCRMODE.equalsIgnoreCase("path"))
            throw new BadRequestAlertException("暂时只支持本地路径模式下的去红操作", "removered", "");
        File img=new File(OCRFILEPATH,param.getImg());
        OCRResponse response=ocrClient.rred(img.getPath());
        if(response.getRet()==0)
            param.setBase64(encodeBase64File(img));
        else
            throw new BadRequestAlertException("去红操作失败", "removered", "");

        return param;
    }

    public OCRRecord getByUrl(String url,String fullfilename,boolean save)
    {
        if(StringUtils.isEmpty(fullfilename))
            fullfilename = FileUtil.getUrlParameterReg(url, "fullfilename");
        String ocrrecordid=DigestUtils.md5DigestAsHex((url+"||"+fullfilename).getBytes()).toLowerCase();
        String extname = "";
        if(!StringUtils.isEmpty(fullfilename))
            extname = "." + FileUtil.getExtensionName(fullfilename);
        else
            extname = "." + FileUtil.getExtensionNameFromUrl(url);
        if(StringUtils.isEmpty(extname))
            throw new BadRequestAlertException("路径中没有包含文件类型信息，后缀名缺失", "view", "");
        String fileName = ocrrecordid + extname;
        if (!FileUtil.canOcr(fileName))
            throw new BadRequestAlertException("不是图片或pdf格式", extname, "");


        OCRRecord record=getById(ocrrecordid,false);
        boolean removeWhenSuss=false;
        if(!"succ".equals(record.getProcstate())) {

            List<ImgItem> list=record.getImgItems();
            if(list.size()==0) {
                File ocrdir = new File(OCRFILEPATH);
                if (!ocrdir.exists())
                    ocrdir.mkdirs();

                File src = new File(ocrdir, fileName);
                if (!FileUtil.downLoadFromURL(url, src))
                    throw new BadRequestAlertException("文件下载失败", "view", "");
                if (extname.equalsIgnoreCase(".pdf"))
                    removeWhenSuss = true;
                try {
                    list = addFile(ocrrecordid, src);
                    for (ImgItem item : list) {
                        record.putImgItem(item);
                    }

                    if(save)
                        ocrrecordService.save(record);
                    if (removeWhenSuss  && src != null && src.exists())
                        src.delete();

                } catch (Exception ex) {
                    throw new InternalServerErrorException("文件处理失败");
                }
            }

        }
        return record;
    }
}
