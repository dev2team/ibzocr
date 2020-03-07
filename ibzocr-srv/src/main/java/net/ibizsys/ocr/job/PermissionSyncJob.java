package net.ibizsys.ocr.job;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import net.ibizsys.ocr.ibizutil.client.uaa.UAAClient;
import org.apache.commons.io.IOUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * 权限：向uaa同步当前系统菜单、权限资源任务类
 */
//@Component   //开启此类需要保证Main中开启了feign ：EnableFeignClients
public class PermissionSyncJob implements ApplicationRunner {

    private Log log = LogFactory.getLog(PermissionSyncJob.class);

    @Autowired
    private UAAClient client;

    @Value("${ibiz.enablePermissionValid:false}")
    boolean enablePermissionValid;  //是否开启权限校验

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if(enablePermissionValid){
            try {
                InputStream menu = this.getClass().getResourceAsStream("/appmenu/xfweb_main.json");
                InputStream permission= this.getClass().getResourceAsStream("/decapability/xfwebDECapability.json");
                String permissionResult = IOUtils.toString(permission,"UTF-8");
                JSONArray jsonNodePermission = JSONArray.parseArray(permissionResult);
                String menuResult = IOUtils.toString(menu,"UTF-8");
                JSONObject jsonNodeMenu = JSONObject.parseObject(menuResult);
                Map<String,Object> map=new HashMap<String,Object>();
                map.put("menu",jsonNodeMenu);
                map.put("permission",jsonNodePermission);
                client.pushpermissiondata(map,"F8DFB5BA-4DB3-4E3F-9AB5-2B1EEE6B46E1");
            }
            catch (Exception ex) {
                log.error(String.format("向UAA同步数据发生错误，请检查UAA服务是否正常! [%s]",ex));
            }
        }
    }
}