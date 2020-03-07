package net.ibizsys.ocr.ibizutil.aspect;

import net.ibizsys.ocr.ibizutil.annotation.Audit;
import net.ibizsys.ocr.ibizutil.domain.EntityBase;
import net.ibizsys.ocr.ibizutil.domain.IBZDataAudit;
import net.ibizsys.ocr.ibizutil.helper.DataAuditHelper;
import net.ibizsys.ocr.ibizutil.helper.IPHelper;
import net.ibizsys.ocr.ibizutil.security.AuthenticationUser;
import net.ibizsys.ocr.ibizutil.service.IBZDataAuditService;
import net.ibizsys.ocr.ibizutil.service.ServiceImplBase;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Field;
import java.sql.Timestamp;
import java.util.Date;
import java.util.Map;

/**
 * 实体数据审计切面类
 */
@Aspect
@Component
public class AuditAspect
{
    @Autowired
    IBZDataAuditService dataAuditService;

    /**
     * 实体数据建立切面，在成功创建数据后将新增数据内容记录审计日志内（审计明细【AuditInfo】中只记录审计属性变化情况，审计属性在平台属性中配置）
     * @param point
     */
    @AfterReturning(value = "execution(* net.ibizsys.ocr.*.service.*.create(..))")
    public void create(JoinPoint point){
        HttpServletRequest request=null;
        RequestAttributes requestAttributes=RequestContextHolder.getRequestAttributes();
        if(requestAttributes!=null){
            request=((ServletRequestAttributes)requestAttributes).getRequest();
        }
        Object [] args = point.getArgs();
        if(args.length>0){
            Object serviceObj=point.getTarget();
            Object serviceParam =args[0];
            if (serviceParam instanceof EntityBase && serviceObj instanceof ServiceImplBase){
                EntityBase curEntity=(EntityBase)serviceParam;//创建数据
                Map<Field, Audit> auditFields= curEntity.getAuditField();
                if(auditFields.size()==0)//是否有审计属性
                    return;
                String auditResult = DataAuditHelper.getInstance().CompareAuditObjectByInsert(curEntity,auditFields);//获取审计明细
                saveAuditData("创建",curEntity.getClass().getSimpleName(),curEntity.getSrfkey(),request,auditResult,1);//记录审计日志
                return;
            }
        }
    }
    /**
     * 实体数据更新切面，在成功更新数据后将新增数据内容记录审计日志内（审计明细【AuditInfo】中只记录审计属性变化情况，审计属性在平台属性中配置）
     * 使用环切【@Around】获取到更新前后的实体数据并进行差异比较，并将差异内容记入审计日志内
     * @param point
     */
    @Around("execution(* net.ibizsys.ocr.*.service.*.update(..))")
    public Object update(ProceedingJoinPoint point) throws Throwable {
        HttpServletRequest request=null;
        RequestAttributes requestAttributes=RequestContextHolder.getRequestAttributes();
        if(requestAttributes!=null){
            request=((ServletRequestAttributes)requestAttributes).getRequest();
        }
        Object serviceObj=point.getTarget();
        Object args[]=point.getArgs();
        if(args.length>0){
            Object arg=args[0];
            if(arg instanceof EntityBase && serviceObj instanceof ServiceImplBase){
                ServiceImplBase service= (ServiceImplBase) serviceObj;
                EntityBase curEntity= (EntityBase) arg;
                Map<Field, Audit> auditFields= curEntity.getAuditField();
                if(auditFields.size()==0)//是否有审计属性
                  return point.proceed();
                EntityBase before_entity= curEntity.getClass().newInstance();
                before_entity.setSrfkey(curEntity.getSrfkey());
                service.get(before_entity);//获取更新前的数据
                point.proceed();//执行更新操作
                EntityBase after_entity= curEntity.getClass().newInstance();
                after_entity.setSrfkey(curEntity.getSrfkey());
                service.get(after_entity);//获取更新后的数据
                String auditResult=DataAuditHelper.getInstance().CompareAuditObjectByUpdate(before_entity,after_entity,auditFields);//比较更新前后差异内容
                int isDataChanged=1;
                if(StringUtils.isEmpty(auditResult))//审计内容是否发生变化
                    isDataChanged=0;
                saveAuditData("更新",curEntity.getClass().getSimpleName(),curEntity.getSrfkey(),request,auditResult,isDataChanged);//记录审计日志
            }
        }
        return true;
    }

    /**
     * 实体数据更新切面，在成功更新数据后将新增数据内容记录审计日志内（审计明细【AuditInfo】中只记录审计属性变化情况，审计属性在平台属性中配置）
     * 使用环切【@Around】获取要删除的完整数据，并将审计属性相关信息记录到审计日志中
     * @param point
     * @return
     * @throws Throwable
     */
    @Around("execution(* net.ibizsys.ocr.*.service.*.remove(..))")
    public Object remove(ProceedingJoinPoint point) throws Throwable {
        HttpServletRequest request=null;
        RequestAttributes requestAttributes=RequestContextHolder.getRequestAttributes();
        if(requestAttributes!=null){
            request=((ServletRequestAttributes)requestAttributes).getRequest();
        }
        Object serviceObj=point.getTarget();
        Object args[]=point.getArgs();
        if(args.length>0){
            Object arg=args[0];
            if(arg instanceof EntityBase && serviceObj instanceof ServiceImplBase){
                ServiceImplBase service= (ServiceImplBase) serviceObj;
                EntityBase curEntity= (EntityBase) arg;
                Map<Field, Audit> auditFields= curEntity.getAuditField();
                if(auditFields.size()==0)//是否有审计属性
                  return point.proceed();//无审计属性，跳过审计，执行remove
                EntityBase remove_entity= curEntity.getClass().newInstance();
                remove_entity.setSrfkey(curEntity.getSrfkey());
                service.get(remove_entity);//获取要删除的完整数据
                point.proceed();//执行remove
                String auditResult=DataAuditHelper.getInstance().CompareAuditObjectByRemove(remove_entity,auditFields);//获取审计明细
                saveAuditData("删除",curEntity.getClass().getSimpleName(),curEntity.getSrfkey(),request,auditResult,1);//记录审计日志
            }
        }
        return true;
    }

    /**
     * 保存审计数据
     * @param auditLogicName
     * @param entityName
     * @param srfkey
     * @param request
     * @param auditResult
     * @param isDataChanged
     */
    private void saveAuditData(String auditLogicName,String entityName,Object srfkey,HttpServletRequest request,String auditResult,int isDataChanged){
        IBZDataAudit dataAudit =new IBZDataAudit();
        dataAudit.setOppersonid(AuthenticationUser.getAuthenticationUser().getUserid());
        dataAudit.setOppersonname(String.format("%s[%s]",AuthenticationUser.getAuthenticationUser().getPersonname(),AuthenticationUser.getAuthenticationUser().getOrgname()));
        dataAudit.setAudittype(auditLogicName);
        dataAudit.setAuditobject(entityName);
        dataAudit.setAuditobjectdata(srfkey);
        dataAudit.setOptime(new Timestamp(new Date().getTime()));
        if(request!=null)
            dataAudit.setIpaddress(IPHelper.getIpAddress(request, AuthenticationUser.getAuthenticationUser()));
        dataAudit.setAuditinfo(auditResult);
        dataAudit.setIsdatachanged(isDataChanged);
        dataAuditService.save(dataAudit);
    }
}