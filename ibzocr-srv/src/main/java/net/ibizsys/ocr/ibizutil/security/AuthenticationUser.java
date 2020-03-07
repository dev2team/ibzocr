package net.ibizsys.ocr.ibizutil.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.ObjectUtils;
import java.util.Map;
import java.util.HashMap;
import java.sql.Timestamp;
import java.util.Collection;
import com.alibaba.fastjson.JSONObject;

@Data
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class AuthenticationUser implements UserDetails
{
	public AuthenticationUser()
	{

	}

	private String userid;
	private String username;
	private String personname;
	private String usercode;
	private String loginname;
	private String password;
	private String domain;
	private String mdeptid;
	private String mdeptcode;
	private String mdeptname;
	private String bcode;
	private String postid;
	private String postcode;
	private String postname;
	private String orgid;
	private String orgcode;
	private String orgname;
	private String nickname;
	private String email;
	private String avatar;
	private String phone;
	private String reserver;
	private String usericon;
	private String sex;
	private Timestamp birthday;
	private String certcode;
	private String addr;
	private String theme;
	private String fontsize;
	private String lang;
	private String memo;
	private Map <String,String> sessionParams;
	@JsonIgnore
	private   Collection<GrantedAuthority> authorities;
    @JsonIgnore
    private int superuser;
    @JsonIgnore
    private JSONObject permisionList;
    private String levelcode;//单位级别编码
    @JsonIgnore
    private Map<String,String> userSessionParam;//用户自定义session值


	@JsonIgnore
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@JsonIgnore
	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public static AuthenticationUser getAuthenticationUser()
	{
        if(SecurityContextHolder.getContext()==null||SecurityContextHolder.getContext().getAuthentication()==null||SecurityContextHolder.getContext().getAuthentication().getPrincipal()==null){
			return new AuthenticationUser();
		}
    	Object userDetails = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		AuthenticationUser authuserdetail;
		if(userDetails instanceof AuthenticationUser ) {
			authuserdetail= (AuthenticationUser)userDetails;
		}
		else {
			authuserdetail=new AuthenticationUser();
		}
	 	return authuserdetail;
	}

    public Map <String,String> getSessionParams()
    {
		if(this.sessionParams==null)
		{
			sessionParams = getUserSessionParam();
			sessionParams.put("srfpersonid", this.getUserid());
			sessionParams.put("srfpersonname", this.getPersonname());
			sessionParams.put("srforgsectorid", this.getMdeptid());
			sessionParams.put("srforgsectorcode", this.getMdeptcode());
			sessionParams.put("srforgsectorname", this.getMdeptname());
			sessionParams.put("srforgid", this.getOrgid());
			sessionParams.put("srforgcode", this.getOrgcode());
			sessionParams.put("srforgname", this.getOrgname());
			sessionParams.put("srfuserid", this.getUserid());
			sessionParams.put("srfusername", this.getPersonname());
			sessionParams.put("srfusermode", "");
			sessionParams.put("srforgsectorbc", this.getBcode());
			sessionParams.put("srfloginname", this.getLoginname());
			sessionParams.put("srflocale", this.getLang());
			sessionParams.put("srftimezone", "");
    		sessionParams.put("srfusercode", this.getUsercode());
		}
		return this.sessionParams;
    }
    private Map<String, String> getUserSessionParam() {
		if(userSessionParam!=null)
			return userSessionParam;
		else
			return new HashMap<>();
    }
}
