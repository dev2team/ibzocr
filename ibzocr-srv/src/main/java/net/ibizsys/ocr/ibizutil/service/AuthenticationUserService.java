package net.ibizsys.ocr.ibizutil.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service("AuthenticationUserService")
public class AuthenticationUserService implements UserDetailsService {

    @Autowired
    private IBZUSERService userService;


    @Override
    public UserDetails loadUserByUsername(String username){
        return userService.getByUsername(username);
    }




}
