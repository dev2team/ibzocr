package net.ibizsys.ocr.ibizutil.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD})
public @interface Audit
{
    String fieldLogicName() default "";//字段逻辑名称
    String dictName() default "";//代码表名称
    String fieldType() default"";//字段类型
    String format() default "";//格式化
}


