package net.ibizsys.ocr.config;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import net.ibizsys.ocr.dto.ImgItem;
import net.ibizsys.ocr.ocr.service.OCRRecordService;
import net.ibizsys.ocr.ocr.service.OCRService;

import java.util.concurrent.CompletableFuture;

@Component
public class MyWebSocketHandler extends AbstractWebSocketHandler {


    @Autowired
    private OCRService ocrService;

    @Autowired
    private OCRRecordService ocrRecordService;



    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        JSONObject jsonObject = JSON.parseObject(message.getPayload());
        String img=jsonObject.get("img").toString();
        String ocrrecordid=jsonObject.get("ocrrecordid").toString();
        ImgItem imgItem = new ImgItem();
        imgItem.setImg(img);
        CompletableFuture<ImgItem> comp= ocrService.imgocrAsync(ocrrecordid,imgItem,true);

        comp.join();
        imgItem = comp.get();


        JSONObject json = (JSONObject) JSONObject.toJSON(imgItem);
        if(!StringUtils.isEmpty(imgItem.getBase64()))
            json.put("base64",imgItem.getBase64());

        session.sendMessage(new TextMessage(json.toString()));
    }




}