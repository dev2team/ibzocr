package net.ibizsys.ocr.ibizutil.service;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.springframework.cglib.beans.BeanCopier;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import net.ibizsys.ocr.ibizutil.domain.IBZUSER;
import net.ibizsys.ocr.ibizutil.mapper.IBZUSERMapper;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;

/**
 * 实体[IBZUSER] 服务对象接口实现
 */
@Service
public class IBZUSERServiceImpl extends ServiceImpl<IBZUSERMapper, IBZUSER> implements IBZUSERService{

	@Resource
	private IBZUSERMapper ibzusserMapper;

	public IBZUSER create(IBZUSER user){
		ibzusserMapper.insert(user);
		return ibzusserMapper.selectById(user.getUserid());
	}


	public AuthenticationUser getByUsername(String username){
		if(StringUtils.isEmpty(username))
		throw new UsernameNotFoundException("用户名为空");
		QueryWrapper<IBZUSER> conds=new QueryWrapper<IBZUSER>();
		String[] data=username.split("[|]");
		String loginname="";
		String domains="";
		if(data.length>0)
		loginname=data[0].trim();
		if(data.length>1)
		domains=data[1].trim();
		if(!StringUtils.isEmpty(loginname))
		conds.eq("loginname",loginname);
		if(!StringUtils.isEmpty(domains))
		conds.eq("domains",domains);
		IBZUSER user = this.getOne(conds);
		if (user == null)
		{
		throw new UsernameNotFoundException("用户" + username + "未找到");
		}
		else
		{
		user.setUsername(username);
		return createUserDetails(user);
		}
    }
    public void resetByUsername(String username)
    {

    }

    public  AuthenticationUser createUserDetails(IBZUSER user) {
		AuthenticationUser userdatail = new AuthenticationUser();
		BeanCopier copier=BeanCopier.create(IBZUSER.class,AuthenticationUser.class,false);
		copier.copy(user,userdatail,null);
		return userdatail;
		}
    }