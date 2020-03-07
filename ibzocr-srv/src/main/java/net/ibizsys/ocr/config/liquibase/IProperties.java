package net.ibizsys.ocr.config.liquibase;

public interface IProperties {
    /**
     *获取数据库用户名
     */
    String getUsername();
    /**
     *获取数据库密码
     */
    String getPassword();
    /**
     *获取数据库url
     */
    String getUrl();
    /**
     *获取数据库schema
     */
    String getDefaultSchema();
    /**
     *获取是否同步
     */
    String getIsSyncDBSchema();
    /**
     * liquibase配置文件
     */
    String getConf();
}