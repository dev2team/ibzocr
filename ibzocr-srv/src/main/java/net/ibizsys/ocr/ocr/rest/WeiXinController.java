package net.ibizsys.ocr.ocr.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import net.ibizsys.ocr.ibizutil.domain.IBZUSER;
import net.ibizsys.ocr.ibizutil.mapper.IBZUSERMapper;
import net.ibizsys.ocr.ibizutil.security.AuthTokenUtil;
import net.ibizsys.ocr.ibizutil.security.AuthenticationInfo;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import net.ibizsys.ocr.ibizutil.service.IBZUSERService;

@RestController
@RequestMapping("/wx")
public class WeiXinController {

    private static String appId = "wx995309daa32888ce"; // 小程序id

    private static String secct = "de322b487d315ad474bc84e63b2cf877"; // 小程序密钥

    @Autowired
    IBZUSERService ibzUserService;

    @Autowired
    @Qualifier("AuthenticationUserService")
    private UserDetailsService userDetailsService;

    @Autowired
    private AuthTokenUtil jwtTokenUtil;

    @Autowired
	private IBZUSERMapper ibzuserMapper;

    /**
     * 小程序登录
     * 
     * @param code 用户登录凭证
     * @return
     */
    @PostMapping("/login")
    public Map<String, Object> wxLogin(@RequestBody JSONObject object) {
        String code = (String) object.get("code");
        Map<String, Object> result = new HashMap<String, Object>();
        
        result.put("status", 200);
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appId + "&secret=" + secct + "&js_code="
                + code + "&grant_type=authorization_code";
        RestTemplate restTemplate = new RestTemplate();
        String jsonData = restTemplate.getForObject(url, String.class);
        JSONObject data = JSONObject.parseObject(jsonData);
        if (StringUtils.contains(jsonData, "errcode")) {
            // 校验是否出错
            result.put("status", "500");
            result.put("msg", "登录失败");
            return result;
        }
        QueryWrapper<IBZUSER> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("bcode", data.get("openid").toString());
        List<IBZUSER> list = ibzUserService.list(queryWrapper);
        if (list.size() > 0) {
            result.put("user", list.get(0));
            final AuthenticationUser authuserdetail = (AuthenticationUser) userDetailsService
                    .loadUserByUsername(list.get(0).getLoginname());
            // 生成令牌
            final String token = jwtTokenUtil.generateToken(authuserdetail);
            result.put("AuthenticationUser", JSON.toJSON(new AuthenticationInfo(token, authuserdetail)));
        } else {
            IBZUSER ibzuser = new IBZUSER();
            ibzuser.setBcode(data.get("openid").toString());
            ibzuser.setUsername("user1");
            ibzuser.setLoginname("user0305");
            ibzuser.setPassword("88888888");
            ibzuser.setUserid("0200");
            IBZUSER user = ibzUserService.create(ibzuser);
            if(user!=null){
                final AuthenticationUser authuserdetail = (AuthenticationUser) userDetailsService
                .loadUserByUsername("user1");
        final String token = jwtTokenUtil.generateToken(authuserdetail);
        result.put("AuthenticationUser", new AuthenticationInfo(token, authuserdetail));
            }
        }
        return result;
    }
}