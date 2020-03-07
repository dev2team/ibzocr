package net.ibizsys.ocr.boot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ComponentScans;
import org.springframework.context.annotation.AnnotationBeanNameGenerator;
import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceAutoConfigure;
import net.ibizsys.ocr.config.liquibase.MasterProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(exclude = {
 org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
	    org.springframework.boot.autoconfigure.security.oauth2.client.OAuth2ClientAutoConfiguration.class,
	    org.springframework.boot.autoconfigure.security.oauth2.OAuth2AutoConfiguration.class,
		DruidDataSourceAutoConfigure.class
	})
@ComponentScans({
@ComponentScan(basePackages = {"net.ibizsys.ocr"}

				),
})
@EnableAsync
@MapperScan("net.ibizsys.ocr.*.mapper")
@EnableConfigurationProperties({MasterProperties.class})
//@EnableFeignClients(basePackages = {"net.ibizsys.ocr" })
//@EnableEurekaClient
public class ibzocrMain extends SpringBootServletInitializer{

	public static void main(String[] args) {
		SpringApplicationBuilder builder = new SpringApplicationBuilder(ibzocrMain.class);
                builder.run(args) ;
	}

}