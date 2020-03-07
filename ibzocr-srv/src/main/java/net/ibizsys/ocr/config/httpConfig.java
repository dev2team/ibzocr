package net.ibizsys.ocr.config;

import org.apache.catalina.connector.Connector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.ConfigurableWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class httpConfig {

    /* @Value("${server.httpport}")
    public String httpport;

    @Bean
    public WebServerFactoryCustomizer<ConfigurableWebServerFactory> webServerFactoryCustomizer() {
        return new WebServerFactoryCustomizer<ConfigurableWebServerFactory>() {

            @Override
            public void customize(ConfigurableWebServerFactory factory) {
                if (factory instanceof TomcatServletWebServerFactory) {
                    TomcatServletWebServerFactory webServerFactory = (TomcatServletWebServerFactory)factory;
                    Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
                    Integer port = Integer.parseInt(httpport);
                    // 设置http访问的端口号，不能与https端口重复，否则会报端口被占用的错误
                    connector.setPort(port);
                    webServerFactory.addAdditionalTomcatConnectors(connector);
                }
            }
        };
    } */
}