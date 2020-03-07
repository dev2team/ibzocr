package net.ibizsys.ocr.ibizutil.service;

import javax.annotation.Resource;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cglib.beans.BeanCopier;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import net.ibizsys.ocr.ibizutil.mapper.IBZUSERMapper;
import net.ibizsys.ocr.ibizutil.domain.IBZUSER;
import org.springframework.util.StringUtils;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 实体[IBZUSER] 服务对象接口实现
 */
public  interface IBZUSERService extends IService<IBZUSER> {

    @Cacheable( value="ibzocr_users",key = "'getByUsername:'+#p0")
    AuthenticationUser getByUsername(String username);
    @CacheEvict( value="ibzocr_users",key = "'getByUsername:'+#p0")
    void resetByUsername(String username);

    AuthenticationUser createUserDetails(IBZUSER user);

    public IBZUSER create(IBZUSER user);

    }