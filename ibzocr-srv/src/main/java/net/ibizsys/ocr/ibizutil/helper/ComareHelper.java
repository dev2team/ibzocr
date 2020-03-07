package net.ibizsys.ocr.ibizutil.helper;

import org.springframework.util.StringUtils;
/**
 *比较工具类：比较两个对象值是否相等
 */
public class ComareHelper {
    /**
     * @param source 源参数
     * @param target 目标参数
     * @param operator 比较符
     * @return
     */
    public static boolean compare(Object source,Object target,String operator){

        boolean result =false;
        if(StringUtils.isEmpty(operator))
            return result;

        String sourceType=source.getClass().getName(); //源对象类型

        if(sourceType.equals("java.lang.String")){//字符串比较
            String strSource=String.valueOf(source);
            if(operator.equals("==")){
                result= strSource.equals(String.valueOf(target));
            }
            if(operator.equals("!=")){
                result= (!strSource.equals(String.valueOf(target)));
            }
        }
        else if(sourceType.equals("java.lang.Integer")){//整形比较
            int intSource=Integer.parseInt(String.valueOf(source));
            int intTarget=Integer.parseInt(String.valueOf(target));
            if(operator.equals("==")){
                result=(intSource==intTarget);
            }
            else if(operator.equals("!=")){
                result=(intSource!=intTarget);
            }
            else if(operator.equals(">")){
                result=(intSource>intTarget);
            }
            else if(operator.equals("<")){
                result=(intSource< intTarget);
            }
            else if(operator.equals(">=")){
                result=(intSource>=intTarget);
            }
            else if(operator.equals("<=")){
                result=(intSource<=intTarget);
            }
        }
        return result;
    }
}
