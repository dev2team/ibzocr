package net.ibizsys.ocr.ocr.rest;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotBlank;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import net.ibizsys.ocr.dto.OCRFileParam;
import net.ibizsys.ocr.ibizutil.errors.BadRequestAlertException;
import net.ibizsys.ocr.ibizutil.errors.InternalServerErrorException;
import net.ibizsys.ocr.ocr.service.OCRConvertService;
import net.ibizsys.ocr.ocr.util.FileUtil;

@RestController
@RequestMapping("/")
public class OCRFileController {

    private static final String PDF_FIX_NAME = ".pdf";
    private static final String WORD_FIX_NAME = ".docx";

    @Autowired
    @Qualifier("ocrConverWordServiceImp")
    OCRConvertService convertService;

    @Autowired
    @Qualifier("ocrConverDoublePDFServiceImp")
    OCRConvertService convertServicepdf;

    @Value("${ibiz.ocr.ExportPath:/tmp/}")
    private String FILEPATH;

    @GetMapping(value = "ocr/ocrrecord/ocrFile/downloadWord/{ocrrecordid}")
    @ResponseStatus(HttpStatus.OK)
    public void downLoadWord(@Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
                             HttpServletResponse response) throws UnsupportedEncodingException {

        String wordName = ocrrecordid + WORD_FIX_NAME;
        wordName = URLEncoder.encode(wordName, "UTF-8");

        OCRFileParam ocrFileParam = new OCRFileParam();
        ocrFileParam.setFilePath(FILEPATH);
        ocrFileParam.setFileid(ocrrecordid);

        convertService.conver(ocrFileParam);

        response.setContentType("application/msword;charset=UTF-8");
        response.setHeader("Content-disposition", "attachment; filename=" + wordName);

        filedown(FILEPATH + ocrrecordid + WORD_FIX_NAME, response);
    }

    @GetMapping(value = "ocr/ocrrecord/ocrFile/downloadPDF/{ocrrecordid}")
    @ResponseStatus(HttpStatus.OK)
    public void downLoadPdf(@Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
                            HttpServletResponse response) throws UnsupportedEncodingException {

        String pdfName = ocrrecordid + PDF_FIX_NAME;
        pdfName = URLEncoder.encode(pdfName, "UTF-8");

        OCRFileParam ocrFileParam = new OCRFileParam();
        ocrFileParam.setFilePath(FILEPATH);
        ocrFileParam.setFileid(ocrrecordid);

        convertServicepdf.conver(ocrFileParam);

        response.setHeader("Content-disposition", "attachment; filename=" + pdfName);
        filedown(FILEPATH + pdfName, response);
    }


    @GetMapping(value = "ocr/ocrrecord/ocrFile/previewPDF/{ocrrecordid}")
    @ResponseStatus(HttpStatus.OK)
    public void previewPdf(@Validated @NotBlank(message = "ocrrecordid不允许为空") @PathVariable("ocrrecordid") String ocrrecordid,
            HttpServletResponse response) throws UnsupportedEncodingException {

        String pdfName = ocrrecordid + PDF_FIX_NAME;
        pdfName = URLEncoder.encode(pdfName, "UTF-8");

        OCRFileParam ocrFileParam = new OCRFileParam();
        ocrFileParam.setFilePath(FILEPATH);
        ocrFileParam.setFileid(ocrrecordid);

        convertServicepdf.conver(ocrFileParam);

        response.setContentType("application/pdf");
        filedown(FILEPATH + pdfName, response);
    }



    @Value("${ibiz.ocr.FilePath:/app/ocr/}")
    private String OCRFILEPATH;


    @GetMapping(value = "ocr/img/{imgname}")
    @ResponseStatus(HttpStatus.OK)
    public void img(@Validated @NotBlank(message = "图片路径不允许为空") @PathVariable("imgname") String imgname,
                    HttpServletResponse response) {

        if (!FileUtil.isImage(imgname))
            throw new BadRequestAlertException("不是图片格式", imgname, "");
        response.setContentType(FileUtil.getContentType(imgname));


        filedown(OCRFILEPATH + imgname, response);
    }


    private void filedown(String filepath, HttpServletResponse response) {
        BufferedInputStream bis = null;
        BufferedOutputStream bos = null;
        try {
            bis = new BufferedInputStream(new FileInputStream(filepath));
            bos = new BufferedOutputStream(response.getOutputStream());
            byte[] buff = new byte[2048];
            int bytesRead;
            while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
                bos.write(buff, 0, bytesRead);
            }
        } catch (IOException io) {
            throw new InternalServerErrorException("内部发生错误");
        } finally {
            if (bis != null) {
                try {
                    bis.close();
                } catch (IOException e) {

                }
            }
            if (bos != null) {
                try {
                    bos.close();
                } catch (IOException e) {

                }
            }
        }
    }

}
