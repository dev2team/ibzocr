package net.ibizsys.ocr.config.liquibase;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "spring.datasource.dynamic.datasource.tempmaster")
@Data
public class TempMasterProperties implements IProperties{

    private  String url;

    private  String username;

    private  String password;

    private  String isSyncDBSchema;

    private  String defaultSchema;

    private  String conf;
}