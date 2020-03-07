package net.ibizsys.ocr.config;

import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceBuilder;
import com.baomidou.mybatisplus.extension.plugins.PaginationInterceptor;
import com.baomidou.mybatisplus.extension.plugins.PerformanceInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.apache.ibatis.mapping.VendorDatabaseIdProvider;
import org.apache.ibatis.mapping.DatabaseIdProvider;
import java.util.Properties;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

import org.springframework.context.annotation.Primary;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.DataSourceBuilder;
import net.ibizsys.ocr.config.liquibase.IProperties;
import net.ibizsys.ocr.config.liquibase.MasterProperties;
import net.ibizsys.ocr.config.liquibase.TempMasterProperties;
import org.springframework.beans.factory.annotation.Autowired;
import liquibase.integration.spring.SpringLiquibase;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.StringUtils;
import com.alibaba.druid.pool.DruidDataSource;
import org.mybatis.spring.batch.MyBatisCursorItemReader;
import org.apache.ibatis.session.SqlSessionFactory;

@Configuration
public class ibzocrConf {

    @Bean
    public PerformanceInterceptor performanceInterceptor() {
        PerformanceInterceptor performanceInterceptor = new PerformanceInterceptor();
        /*<!--SQL是否格式化 默认false-->*/
        performanceInterceptor.setFormat(true);
        return performanceInterceptor;
    }
    @Bean
    public PaginationInterceptor paginationInterceptor() {
        return new PaginationInterceptor();
    }
    /**
     * 屏蔽json序列化对象属性为空的错误
     * @return
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper().disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }
     /**
     * 多数据源切换
     * @return
     */
    @Bean
    public DatabaseIdProvider getDatabaseIdProvider() {
        DatabaseIdProvider databaseIdProvider = new VendorDatabaseIdProvider();
        Properties p = new Properties();
        p.setProperty("Oracle", "oracle");
        p.setProperty("MySQL", "mysql");
        p.setProperty("DM", "oracle");//达梦数据库使用oracle模式
        p.setProperty("H2", "postgresql");//根据当前运行的数据库设置h2对应的databaseid
        p.setProperty("SQL Server", "sqlserver");
        p.setProperty("PostgreSQL", "postgresql");
        p.setProperty("DB2", "db2");
        databaseIdProvider.setProperties(p);
        return databaseIdProvider;
    }
   /**
     * 主数据源版本管理
     * @param
     * @return
     */
    @Bean
    public SpringLiquibase masterliquibase(MasterProperties masterProperties) {
        return LiquibaseInit(masterProperties);
    }
    /**
     * 临时数据源版本管理
     * @param
     * @return
     */
    @Bean
    public SpringLiquibase tempMasterliquibase(TempMasterProperties tempMasterProperties) {
        return LiquibaseInit(tempMasterProperties);
    }
    /**
     * liquibase初始化数据库
     * @param properties
     * @return
     */
   private SpringLiquibase LiquibaseInit(IProperties properties){
       DruidDataSource druidDataSource = new DruidDataSource();
       druidDataSource.setUsername(properties.getUsername());
       druidDataSource.setPassword(properties.getPassword());
       druidDataSource.setUrl(properties.getUrl());

       SpringLiquibase liquibase = new SpringLiquibase();
       liquibase.setDataSource(druidDataSource);
       liquibase.setChangeLog(getChangelog(properties.getIsSyncDBSchema(),properties.getConf()));
       liquibase.setContexts("development,test,production");
       liquibase.setShouldRun(true);
       liquibase.setDefaultSchema(properties.getDefaultSchema());
       return liquibase;
   }
    /**
     * 获取数据库差异文件
     * @param isSyncDBSchema  是否同步表结构
     * @param conf  //liquibase配置文件
     * @return
     */
    private String getChangelog(String isSyncDBSchema,String conf){
        String defaultChangelog="classpath:liquibase/empty.xml";

        if((!StringUtils.isEmpty(isSyncDBSchema))&&(!StringUtils.isEmpty(conf))){
            if(isSyncDBSchema.toLowerCase().equals("true"))
                defaultChangelog=conf;
        }
            return defaultChangelog;
    }
    /**
     * mybatis游标查询 MyBatisCursorItemReader
     * @param sqlSessionFactory
     * @return
     */
    @Bean
    public MyBatisCursorItemReader myMyBatisCursorItemReader(SqlSessionFactory sqlSessionFactory) {
        MyBatisCursorItemReader  reader =new MyBatisCursorItemReader();
        reader.setQueryId("");
        reader.setSqlSessionFactory(sqlSessionFactory);
        return reader;
    }


    @Value("${ibiz.ocr.poolsize:2}")
    private Integer poolsize;

    @Bean("asyncOcrExecutor")
    public Executor asyncOcrExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(poolsize);
        executor.setMaxPoolSize(poolsize);
        executor.setQueueCapacity(2000);
        executor.setKeepAliveSeconds(600);
        executor.setThreadNamePrefix("asyncOcrExecutor-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        return executor;
    }
}