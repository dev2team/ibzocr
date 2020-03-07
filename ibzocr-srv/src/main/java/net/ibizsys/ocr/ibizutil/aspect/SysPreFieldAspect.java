package net.ibizsys.ocr.ibizutil.aspect;

import net.ibizsys.ocr.ibizutil.annotation.PreField;
import net.ibizsys.ocr.ibizutil.domain.EntityBase;
import net.ibizsys.ocr.ibizutil.enums.FillMode;
import net.ibizsys.ocr.ibizutil.enums.PredefinedType;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.cglib.beans.BeanMap;
import org.springframework.stereotype.Component;
import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;
import org.springframework.core.annotation.Order;

/**
 * 实体预置属性切面：用于填充实体预置属性
 */
@Aspect
@Order(0)
@Component
public class SysPreFieldAspect
{
    @Before(value = "execution(* net.ibizsys.ocr.*.mapper.*.insert(..))")
    public void BeforeCreate(JoinPoint point) {
        ExecuteAspect(point,FillMode.INSERT);
    }

    @Before(value = "execution(* net.ibizsys.ocr.*.mapper.*.updateById(..))")
    public void BeforeUpdate(JoinPoint point) {
        ExecuteAspect(point,FillMode.UPDATE);
    }

    /**
     * 执行切面逻辑
     * @param joinPoint  切入点
     * @param serviceFillMode  填充模式
     * @return
     */
    public Object ExecuteAspect(JoinPoint joinPoint,FillMode serviceFillMode){
        Object [] args = joinPoint.getArgs();//入参
        if(args.length>0){
            Object obj =args[0];    //入参
            if (obj instanceof EntityBase){
                EntityBase entityBase=(EntityBase)obj;
                EntityBase.CacheFieldMap.getFieldMap(obj.getClass().getName());//填充缓存列表
                Map<Field, PreField> preFields= entityBase.SearchPreField(); //从缓存中获取当前类预置属性
                fillPreField(entityBase,serviceFillMode, preFields);//填充预置属性
                return true;
            }
        }
        return true;
    }

    /**
     * 填充系统预置属性
     * @param et   当前实体对象
     * @param serviceFillMode  操作类型 insert or update
     */
    private void fillPreField(EntityBase et, FillMode serviceFillMode,Map<Field, PreField> preFields){
        if(preFields.size()==0)
            return ;
        AuthenticationUser curuser=AuthenticationUser.getAuthenticationUser();
        BeanMap beanMap = BeanMap.create(et);
        for (Map.Entry<Field,PreField> entry : preFields.entrySet()) {
            Field prefield=entry.getKey();//获取注解字段
            String filename=prefield.getName();
            Object objField = beanMap.get(filename);
            PreField fieldAnnotation=entry.getValue();//获取注解值
            FillMode fieldFillMode=fieldAnnotation.fill();
            PredefinedType prefieldType=fieldAnnotation.preType();

            //字段值为空或者是更新属性时
            if(org.springframework.util.StringUtils.isEmpty(objField)||prefieldType==PredefinedType.UPDATEDATE||
                    prefieldType==PredefinedType.UPDATEMAN||prefieldType==PredefinedType.UPDATEMANNAME){

                if(serviceFillMode==fieldFillMode||fieldFillMode==FillMode.INSERT_UPDATE){
                    switch(prefieldType){//根据注解给预置属性填充值
                        case CREATEMAN: beanMap.put(filename,curuser.getUserid());break;
                        case CREATEMANNAME: beanMap.put(filename,curuser.getPersonname());break;
                        case UPDATEMAN: beanMap.put(filename,curuser.getUserid());break;
                        case UPDATEMANNAME: beanMap.put(filename,curuser.getPersonname());break;
                        case CREATEDATE:beanMap.put(filename,new Timestamp(new Date().getTime()));break;
                        case UPDATEDATE:beanMap.put(filename,new Timestamp(new Date().getTime()));break;
                        case ORGID:beanMap.put(filename,curuser.getOrgid());break;
                        case ORGNAME:beanMap.put(filename,curuser.getOrgname());break;
                        case ORGSECTORID:beanMap.put(filename,curuser.getMdeptid());break;
                        case ORGSECTORNAME:beanMap.put(filename,curuser.getMdeptname());break;
                        //case LOGICVALID:beanMap.put(filename,0);break;
                    }
                }
            }
        }
    }
}
