package net.ibizsys.ocr.ocr.service.impl;

import net.ibizsys.ocr.dto.OCRFileParam;
import net.ibizsys.ocr.ibizutil.errors.InternalServerErrorException;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.service.OCRConvertService;
import net.ibizsys.ocr.ocr.service.OCRRecordService;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
@Qualifier("ocrConverWordServiceImp")
public class OCRConverWordServiceImp implements OCRConvertService {

    private static final String WORD_FIX_NAME = ".docx";

    @Autowired
    OCRRecordService ocrrecordService;

    @Override
    public void conver(OCRFileParam ocrFileParam) {
        String fileid = ocrFileParam.getFileid();
        OCRRecord ocrRecord = new OCRRecord();
        ocrRecord.setOcrrecordid(fileid);
        ocrRecord = ocrrecordService.get(ocrRecord);

        ocrFileParam.setOcrRecord(ocrRecord);

        createWord(ocrFileParam);
        writeDataDocx(ocrFileParam);
    }

    /**
     * 创建目录及文件
     *
     * @param
     * @param
     */
    private void createWord(OCRFileParam ocrFileParam) {
        String path = ocrFileParam.getFilePath();
        String fileName = ocrFileParam.getFileid() + WORD_FIX_NAME;

        File file = new File(path);
        if (!file.exists()) file.mkdirs();
        //这里使用word2007及以上的XWPFDocument来进行构造word
        XWPFDocument document = new XWPFDocument();
        OutputStream stream = null;
        try {
            stream = new FileOutputStream(new File(file, fileName));
            document.write(stream);
        } catch (FileNotFoundException e) {
            throw new InternalServerErrorException("创建文件失败" + file.getName());
        } catch (IOException e) {
            throw new InternalServerErrorException("创建文件发生错误" + file.getName());
        } finally {
            if (stream != null) ;
            try {
                stream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 向文件中写入word
     *
     * @param
     * @param
     */
    private void writeDataDocx(OCRFileParam ocrFileParam) {
        String path = ocrFileParam.getFilePath() + ocrFileParam.getFileid() + WORD_FIX_NAME;
        String data = ocrFileParam.getOcrRecord().getContent();
        InputStream istream = null;
        OutputStream ostream = null;
        XWPFDocument document = new XWPFDocument();
        try {
            istream = new FileInputStream(path);
            ostream = new FileOutputStream(path);
            //添加一个段落
            XWPFParagraph p1 = document.createParagraph();
            XWPFRun r1 = p1.createRun();
            r1.setText(data);
            document.write(ostream);
        } catch (FileNotFoundException e) {
            throw new InternalServerErrorException("写入文件时发生异常" + path);
        } catch (IOException e) {
            throw new InternalServerErrorException("写入文件时io异常" + path);
        } finally {
            if (istream != null) {
                try {
                    istream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (ostream != null) {
                try {
                    ostream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
