package net.ibizsys.ocr.ibizutil.service;

import java.util.HashMap;
import java.util.Map;
import lombok.Data;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import org.apache.poi.ss.formula.functions.T;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import net.ibizsys.ocr.ibizutil.domain.DataObj;

@Data
public abstract class SearchFilterBase  {

	public Map<String,String> sessioncontext;	 //用户上下文
	public DataObj srfparentdata;	 //父业务数据
	public QueryWrapper<T> permissionCond;  //拼接权限条件

	/**
	 * 获取用户上下文
	 * @param
	 */
	public Map getSessioncontext() {
	    AuthenticationUser curuser=AuthenticationUser.getAuthenticationUser();
		if(curuser!=null)
		    sessioncontext =curuser.getSessionParams();
		else
		    sessioncontext =new HashMap();
		return sessioncontext;
	}
	/**
	 * 设置用户上下文
	 * @param sessioncontext
	 */
	public void setSessioncontext(Map sessioncontext) {
		this.sessioncontext = sessioncontext;
	}
	/**
	 * 获取数据上下文
	 * @return
	 */
	public DataObj getDatacontext() {
		return srfparentdata;
	}
	/**
	 * 获取网页请求上下文
	 * @return
	 */
	public DataObj getWebcontext() {
		return srfparentdata;
	}
}