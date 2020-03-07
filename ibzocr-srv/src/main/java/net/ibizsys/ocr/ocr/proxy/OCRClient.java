package net.ibizsys.ocr.ocr.proxy;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Slf4j
@Component
public class OCRClient {

    @Value("${ibiz.ocr.ApiPath:http://172.16.100.243:8010/ocr}")
    private String ocrApiPath;

    private Integer ocrResize=0;

    @Value("${ibiz.ocr.RemoveRed:0}")
    private Integer ocrRemoveRed;

    @Value("${ibiz.ocr.Detectangle:1}")
    private Integer ocrDetectangle;

    private List<String> addrs;
    private synchronized List<String> getAddrs()
    {
        if(addrs==null) {
            addrs=new ArrayList<>();
            String[] arr=ocrApiPath.replace(";",",").split(",");
            for(String str:arr) {
                String tmp=str.trim();
                if(!StringUtils.isEmpty(tmp))
                    addrs.add(tmp);
            }
        }
        return addrs;
    }
    private String lastAddr="";
    private String getApiPath()
    {
        String rt="";
        List<String> addrs=this.getAddrs();
        int i=(new Random().nextInt())%addrs.size();
        rt=addrs.get(i);
        if(rt.equals(lastAddr))
            return getApiPath();
        if(addrs.size()>1)
            lastAddr=rt;
        return rt;
    }



    public OCRResponse ocrByImgBase64(String fileName,String base64) throws Exception  {
        OCRRequest request=new OCRRequest(fileName,base64);
        request.setRemovered(ocrRemoveRed);
        request.setResize(ocrResize);
        request.setDetectangle(ocrDetectangle);
        return ocr(request);
    }
    public OCRResponse ocrByImgPath(String path)  throws Exception {
        OCRRequest request=new OCRRequest(path);
        request.setRemovered(ocrRemoveRed);
        request.setResize(ocrResize);
        request.setDetectangle(ocrDetectangle);
        return ocr(request);
    }
    public OCRResponse ocrByImgUrl(String fileName,String imgUrl) throws Exception  {
        OCRRequest request=new OCRRequest(fileName,imgUrl);
        request.setRemovered(ocrRemoveRed);
        request.setResize(ocrResize);
        request.setDetectangle(ocrDetectangle);
        return ocr(request);
    }

    public OCRResponse ocr(OCRRequest request)   throws Exception
    {
        return ocr(request,0);
    }

    public OCRResponse ocr(OCRRequest request,int reTry)  throws Exception {
        OCRResponse response=null;

        String addr=getApiPath();
        log.debug("ocr start: "+addr+", " + request.getId());
        HttpClient httpClient = HttpClientBuilder.create().build();
        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
        RestTemplate restTemplate = new RestTemplate(requestFactory);
        HttpHeaders headers = new HttpHeaders();
        MediaType type = MediaType.parseMediaType("application/json; charset=UTF-8");
        headers.setContentType(type);
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        HttpEntity<OCRRequest> formEntity = new HttpEntity(request, headers);
        restTemplate.getMessageConverters().add(new MyMappingJackson2HttpMessageConverter());
        try {
            response = restTemplate.postForObject(addr, formEntity, OCRResponse.class);
        }
        catch(Exception ex)
        {
            if(reTry<3) {
                reTry++;
                log.error("ocr error: 第"+ reTry +"次：" +addr+":"+ request.getId()+"; "+ex);
                return ocr(request,reTry);
            }
            else {
                log.error("ocr error: 多次重试均失败：" +addr+":"+ request.getId()+"; "+ex);
                throw new Exception(ex);
            }
        }

        log.debug("ocr end: " +addr+":"+ request.getId());
        return response;
    }

    public OCRResponse rred(String path)    {
        OCRResponse response=null;

        OCRRequest request =new OCRRequest(path);
        request.setId(DigestUtils.md5DigestAsHex(path.getBytes()));
        String addr=getApiPath().replace("ocr","rred");
        log.debug("rred start: "+addr+", " + request.getId());
        HttpClient httpClient = HttpClientBuilder.create().build();
        ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(httpClient);
        RestTemplate restTemplate = new RestTemplate(requestFactory);
        HttpHeaders headers = new HttpHeaders();
        MediaType type = MediaType.parseMediaType("application/json; charset=UTF-8");
        headers.setContentType(type);
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        HttpEntity<OCRRequest> formEntity = new HttpEntity(request, headers);
        restTemplate.getMessageConverters().add(new MyMappingJackson2HttpMessageConverter());
        try {
            response = restTemplate.postForObject(addr, formEntity, OCRResponse.class);
        }
        catch(Exception ex)
        {

            log.error("rred error: 多次重试均失败：" +addr+":"+ request.getId()+"; "+ex);
            response=new OCRResponse();
            response.setRet(1);
            response.setInfo("rred error: 多次重试均失败：" +addr+":"+ request.getId()+"; "+ex);
            return response;
        }

        log.debug("rred end: " +addr+":"+ request.getId());
        return response;
    }

    public class MyMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter {
        public MyMappingJackson2HttpMessageConverter(){
            List<MediaType> mediaTypes = new ArrayList<>();
            mediaTypes.add(MediaType.TEXT_PLAIN);
            mediaTypes.add(MediaType.TEXT_HTML);  //加入text/html类型的支持
            setSupportedMediaTypes(mediaTypes);
        }
    }
}
