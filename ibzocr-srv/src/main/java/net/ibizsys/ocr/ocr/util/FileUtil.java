package net.ibizsys.ocr.ocr.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;

public class FileUtil {
    private static Hashtable<String, String> type = null;

    public static Hashtable<String, String> getType()
    {
        if (type == null) {
            type = new Hashtable<String, String>();
            type.put(".pdf", "application/pdf");
            type.put(".jpg", "image/jpg");
            type.put(".jpeg", "image/jpeg");
            type.put(".bmp", "image/bmp");
            type.put(".gif", "image/gif");
            type.put(".tif", "image/tiff");
            type.put(".tiff", "image/tiff");
            type.put(".png", "image/png");
        }
        return type;
    }

    public static String getExtensionName(String filename) {
        if ((filename != null) && (filename.length() > 0)) {
            int dot = filename.lastIndexOf('.');
            if ((dot >-1) && (dot < (filename.length() - 1))) {
                return filename.substring(dot + 1).toLowerCase();
            }
        }
        return filename.toLowerCase();
    }


    public static   String getContentType(String filename) {

        String extName="."+getExtensionName(filename);
        if (getType().containsKey(extName))
            return getType().get(extName);
        else
            return "application/octet-stream";

    }

    public static boolean isImage(String filename)
    {
        return getContentType(filename).startsWith("image");
    }

    public static boolean canOcr(String filename)
    {
        return getType().containsKey("."+getExtensionName(filename));
    }


    /**
     * 获取文件后缀
     * @param url
     * @return
     */
    public static String getExtensionNameFromUrl(String url) {
        String nonPramStr = url.substring(0, url.indexOf("?") != -1 ? url.indexOf("?") : url.length());
        String fileName = nonPramStr.substring(nonPramStr.lastIndexOf("/") + 1);
        return getExtensionName(fileName);
    }

    /**
     * 获取url中的参数
     * @param url
     * @param name
     * @return
     */
    public static String getUrlParameterReg(String url, String name) {
        Map<String, String> mapRequest = new HashMap();
        String strUrlParam = truncateUrlPage(url);
        if (strUrlParam == null) {
            return "";
        }
        //每个键值为一组
        String[] arrSplit=strUrlParam.split("[&]");
        for(String strSplit:arrSplit) {
            String[] arrSplitEqual= strSplit.split("[=]");
            //解析出键值
            if(arrSplitEqual.length > 1) {
                //正确解析
                mapRequest.put(arrSplitEqual[0], arrSplitEqual[1]);
            } else if (!arrSplitEqual[0].equals("")) {
                //只有参数没有值，不加入
                mapRequest.put(arrSplitEqual[0], "");
            }
        }
        return mapRequest.get(name);
    }

    /**
     * 去掉url中的路径，留下请求参数部分
     * @param strURL url地址
     * @return url请求参数部分
     */
    private static String truncateUrlPage(String strURL) {
        String strAllParam = null;
        strURL = strURL.trim();
        String[] arrSplit = strURL.split("[?]");
        if(strURL.length() > 1)  {
            if(arrSplit.length > 1) {
                if(arrSplit[1] != null) {
                    strAllParam=arrSplit[1];
                }
            }
        }
        return strAllParam;
    }


    public static boolean downLoadFromURL(String urlAddress, File file)
    {
        if(file.exists())
            return true;
        URL url = null;
        URLConnection connection = null;
        InputStream in = null;
        FileOutputStream os =null;
        try {
            url = new URL(urlAddress);
            connection = url.openConnection();
            in = connection.getInputStream();

            os = new FileOutputStream(file);
            byte[] buffer = new byte[4 * 1024];
            int read;
            while ((read = in.read(buffer)) > 0) {
                os.write(buffer, 0, read);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        finally {
            try
            {
                if(os!=null)
                    os.close();
            }catch (Exception ex){}
            try
            {
                if(in!=null)
                    in.close();
            }catch (Exception ex){}

        }

        return file.exists();



    }
}
