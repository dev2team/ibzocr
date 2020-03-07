package net.ibizsys.ocr.ibizutil.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ ElementType.FIELD})
public @interface Dict
{
	String dictName() default "";//代码表转换类
	String textField() default "";
}
