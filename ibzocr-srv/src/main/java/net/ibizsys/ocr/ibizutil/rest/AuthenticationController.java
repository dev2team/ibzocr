package net.ibizsys.ocr.ibizutil.rest;

import net.ibizsys.ocr.ibizutil.errors.BadRequestAlertException;
import net.ibizsys.ocr.ibizutil.security.*;
import net.ibizsys.ocr.ibizutil.service.IBZUSERService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.util.DigestUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class AuthenticationController
{
    @Value("${ibiz.auth.pwencry:false}")
    private boolean pwencry;

    @Value("${ibiz.jwt.header:Authorization}")
    private String tokenHeader;

    @Autowired
    private AuthTokenUtil jwtTokenUtil;

    @Autowired
    @Qualifier("AuthenticationUserService")
    private UserDetailsService userDetailsService;

    @Autowired
    private IBZUSERService userService;

    @PostMapping(value = "${ibiz.auth.path:ibizutil/login}")
    public ResponseEntity<AuthenticationInfo> login(@Validated @RequestBody AuthorizationLogin authorizationLogin){
        userService.resetByUsername(authorizationLogin.getUsername());
        final AuthenticationUser authuserdetail = (AuthenticationUser) userDetailsService.loadUserByUsername(authorizationLogin.getUsername());
        String password=authorizationLogin.getPassword();
        if(pwencry)
            password=DigestUtils.md5DigestAsHex(authorizationLogin.getPassword().getBytes());
        if(!authuserdetail.getPassword().equals( password )){
            throw new BadRequestAlertException("用户名密码错误",null,null);
        }
        // 生成令牌
        final String token = jwtTokenUtil.generateToken(authuserdetail);
        // 返回 token
        return ResponseEntity.ok().body(new AuthenticationInfo(token,authuserdetail));
    }

    @GetMapping(value = "${ibiz.auth.account:ibizutil/account}")
    public ResponseEntity<AuthenticationUser> getUserInfo(){
        UserDetails userDetails = (UserDetails)  SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AuthenticationUser authuserdetail;
        if(userDetails==null){
            throw new BadRequestAlertException("未能获取用户信息",null,null);
        }
        else if(userDetails instanceof AuthenticationUser ) {
            authuserdetail= (AuthenticationUser)userDetails;
        }
        else {
            authuserdetail= (AuthenticationUser)userDetailsService.loadUserByUsername(userDetails.getUsername());
        }
        return ResponseEntity.ok().body(authuserdetail);
    }
}
