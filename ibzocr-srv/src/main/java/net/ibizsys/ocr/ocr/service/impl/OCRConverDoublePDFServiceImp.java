package net.ibizsys.ocr.ocr.service.impl;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfWriter;
import net.ibizsys.ocr.dto.ImgItem;
import net.ibizsys.ocr.dto.OCRFileParam;
import net.ibizsys.ocr.dto.TextBox;
import net.ibizsys.ocr.ibizutil.errors.InternalServerErrorException;
import net.ibizsys.ocr.ocr.domain.OCRRecord;
import net.ibizsys.ocr.ocr.service.OCRConvertService;
import net.ibizsys.ocr.ocr.service.OCRRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;


@Service
@Qualifier("ocrConverDoublePDFServiceImp")
public class OCRConverDoublePDFServiceImp implements OCRConvertService {

    private static final String PDF_FIX_NAME = ".pdf";

    @Value("${ibiz.ocr.FilePath:/app/ocr/}")
    private String IMGPATH;

    @Autowired
    OCRRecordService ocrrecordService;

    @Override
    public void conver(OCRFileParam ocrFileParam) {
        String fileid = ocrFileParam.getFileid();

        OCRRecord ocrRecord = new OCRRecord();
        ocrRecord.setOcrrecordid(fileid);
        ocrRecord = ocrrecordService.get(ocrRecord);
        List<ImgItem> imgItems = ocrRecord.getImgItems();

        ocrFileParam.setImgItems(imgItems);
        createPDF(ocrFileParam);
    }

    private void createPDF(OCRFileParam ocrFileParam) {
        String toPath = ocrFileParam.getFilePath();
        String pdfName = ocrFileParam.getFileid();
        List<ImgItem> imgItems = ocrFileParam.getImgItems();

        String outPath = toPath + pdfName + PDF_FIX_NAME;//输出路径
        int maxWidth = getMaxWidth(imgItems);
        int maxHeight = getMaxHeight(imgItems);

        Rectangle pSize = new Rectangle(maxWidth, maxHeight);//设置纸张大小
        Document doc = new Document(pSize); //创建文档实例 页边距
        try {
            //创建输出流
            PdfWriter writer = PdfWriter.getInstance(doc, new FileOutputStream(outPath));
            //打开文档
            doc.open();

            BaseFont bfc = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
            PdfContentByte cb = writer.getDirectContent();
            for (ImgItem imgItem : imgItems) {
                createNewPage(doc, cb, bfc, imgItem, maxHeight);
            }
            doc.close();
        } catch (DocumentException | IOException e) {
            throw new InternalServerErrorException("创建PDF失败" + toPath + pdfName);
        }
    }


    private void createNewPage(Document doc, PdfContentByte cb, BaseFont bfc, ImgItem imgItem, int maxHeight) throws DocumentException, IOException {
        int height = imgItem.getHeight();
        int heightDifference = maxHeight - height;
        int xCoordinate = 0;
        int yCoordinate = 0;
        int fontSize = 12;
        String fileName = imgItem.getImg();

        //创建新的一页
        doc.newPage();

        Image image1 = Image.getInstance(IMGPATH + fileName);
        //设置图片位置的x轴和y周
        image1.setAbsolutePosition(0, heightDifference);
        //设置图片的宽度和高度
        image1.scaleAbsolute(imgItem.getWidth(), imgItem.getHeight());
        cb.addImage(image1);

        List<TextBox> res = imgItem.getRes();
        Iterator<TextBox> textBoxIterator = res.iterator();
        while (textBoxIterator.hasNext()) {
            TextBox textBox = textBoxIterator.next();
            String text = textBox.getText();
            List<Integer> box = textBox.getBox();
            xCoordinate = getXCoordinate(box);
            yCoordinate = getYCoordinate(box, height) + heightDifference;
            fontSize = getFontSize(box);
            cb.saveState();
            cb.beginText();
            cb.moveText(xCoordinate, yCoordinate); //设置文字的位置
            cb.setFontAndSize(bfc, fontSize); //设置文字的大小
            cb.setColorFill(new BaseColor(255, 255, 255, 0)); //设置文字颜色
//          cb.setColorFill(BaseColor.RED); //设置文字颜色
            cb.showText(text); //设置文字内容
            cb.endText();
            cb.restoreState();
        }
    }

    private int getFontSize(List<Integer> box) {
        //int fontSize=Math.multiplyExact(2,(box.get(7)-box.get(1)))-18;(fontSize=2*height-18)
        int fontSize = box.get(7) - box.get(1) - 2;
        return fontSize;
    }

    private int getXCoordinate(List<Integer> box) {
        int xCoordinate = 0;
        if (!box.isEmpty() && box.size() > 0) {
            xCoordinate = box.get(0);
        }
        return xCoordinate;
    }

    private int getYCoordinate(List<Integer> box, int height) {
        int yCoordinate = 0;
        if (!box.isEmpty() && box.size() > 0) {
            yCoordinate = height - box.get(7);
        }
        return yCoordinate;
    }

    private int getMaxHeight(List<ImgItem> imgItems) {
        int maxHeight = 0;
        Iterator<ImgItem> iterator = imgItems.iterator();
        while (iterator.hasNext()) {
            ImgItem next = iterator.next();
            int height = next.getHeight();
            if (height > maxHeight) {
                maxHeight = height;
            }
        }
        return maxHeight;
    }

    private int getMaxWidth(List<ImgItem> imgItems) {
        int maxWidth = 0;
        Iterator<ImgItem> iterator = imgItems.iterator();
        while (iterator.hasNext()) {
            ImgItem next = iterator.next();
            int width = next.getWidth();
            if (width > maxWidth) {
                maxWidth = width;
            }
        }
        return maxWidth;
    }

}
