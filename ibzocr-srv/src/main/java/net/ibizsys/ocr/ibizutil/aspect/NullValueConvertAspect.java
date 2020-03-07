package net.ibizsys.ocr.ibizutil.aspect;

import net.ibizsys.ocr.ibizutil.domain.EntityBase;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import java.lang.reflect.Field;

/**
 * 空值转换切面类：
 * 解决某些数据库对空字符串与null敏感（如：postgresql），导致保存实体属性时，将空字符串保存到数据库时发生约束错误
 * 作用：将实体属性中的字符串（""）转换为null
 */
@Aspect
@Order(1)
@Component
public class NullValueConvertAspect
{
    @Before(value = "execution(* net.ibizsys.ocr.*.mapper.*.insert(..)) || execution(* net.ibizsys.ocr.*.mapper.*.updateById(..))" )
    public void BeforeCreateOrUpdate(JoinPoint point) {
        ExecuteAspect(point);
    }
    /**
     * 执行切面逻辑
     * @param joinPoint  切入点
     * @return
     */
    public Object ExecuteAspect(JoinPoint joinPoint){
        Object [] args = joinPoint.getArgs();//入参
        if(args.length>0){
            Object obj =args[0];    //入参
            if (obj instanceof EntityBase){
                EntityBase entityBase=(EntityBase)obj;
                processNullValue(entityBase);
                return true;
            }
        }
        return true;
    }

    /**
     * 新建或更新数据库时，将空字符串转换为null，避免数据保存时出现约束错误
     * @param entityBase
     */
    private void processNullValue(EntityBase entityBase){
        if(!StringUtils.isEmpty(entityBase)){
            Field[] fields = entityBase.getClass().getDeclaredFields();
            for(Field field: fields){
                String fieldName=field.getName();
                Object entityVal=entityBase.get(fieldName);
                if(StringUtils.isEmpty(entityVal)){
                    entityBase.set(fieldName,null);
                }
            }
        }
    }
}
