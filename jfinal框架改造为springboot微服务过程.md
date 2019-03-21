---
title: jfinal框架改造为springboot微服务过程
comments: true
abbrlink: 635b
date: 2019-03-18 08:41:07
categories:
tags:
---

jfinal项目重构为springboot项目

<!-- more -->

## eclipse插件安装

我们选择的插件是 **Spring Tools 4 - for Spring Boot (aka Spring Tool Suite 4) 4.1.2.RELEASE**

## maven下载安装与eclipse配置

我采用的是 maven 3.6

## configConstant/PropKit -> application.properties

例如，区分开发环境与正式环境

```shell
spring.profiles.active=dev
-- spring.profiles.active=pro
-- debug=true

-- application.properties
-- application-dev.properties
-- application-pro.properties
```

常量配置

```shell
#application.properties
spring.redis.host=117.78.47.178
spring.redis.name=holdredis
spring.redis.password=r_123456
spring.redis.database=2
spring.redis.port=6379
```

java中取的配置文件的值

```java
@Value("${spring.redis.host}")
private String redisHost;
@Value("${spring.redis.name}")
private String redisName;
@Value("${spring.redis.password}")
private String redisPassword;
@Value("${spring.redis.port}")
private String redisPort;
@Value("${spring.redis.database}")
private String redisDatabase;
```

## 路由配置 configRoute -> requestmapping

jfinal中的：
```java
public void configRoute(Routes me) {
    me.add("/hello", HelloController.class);
}
```
修改为：
```java
/**
HelloController.class
*/
@RestController
@RequestMapping("hello")
public class HelloController extends ControllerExt{

	@RequestMapping("addvote")
	public Object addvote(){
      // code
  }

```

## 插件配置 configPlugin ->  @Configuration

例如，如何使用jfinal的ActiveRecordPlugin插件操作数据库，原本jfinal的代码：
(其中包括Redis插件)

```java
/**
	 * 配置插件
	 */
	public void configPlugin(Plugins me) {
		DruidPlugin druidPlugin = createDruidPlugin();
		me.add(druidPlugin);

		// 配置ActiveRecord插件
		ActiveRecordPlugin arp = new ActiveRecordPlugin(druidPlugin);
		me.add(arp);
		// 所有配置在 MappingKit 中搞定
		_MappingKit.mapping(arp);

		//mall商城数据源
		DruidPlugin druidPlugin_database1 = createDruidPlugin_database1();
		wallFilter = new WallFilter(); // 加强数据库安全
		wallFilter.setDbType("mysql");
		druidPlugin_mall.addFilter(wallFilter);
		druidPlugin_mall.addFilter(new StatFilter()); // 添加 StatFilter 才会有统计数据
		me.add(druidPlugin_mall);
		ActiveRecordPlugin arp_database1 = new ActiveRecordPlugin("database1",druidPlugin_mall);
		me.add(arp_mall);
		// 注册Redis插件
		RedisPlugin RedisPlugin;
		if (PropKit.getBoolean("devMode", true))
			RedisPlugin = new RedisPlugin(PropKit.get("redisname"), PropKit.get("redisserverip"), Integer.parseInt(PropKit.get("redisport")), 0,
					PropKit.get("redispw"), 2);
		else
			RedisPlugin = new RedisPlugin(PropKit.get("redisname"), PropKit.get("redisserverip"), Integer.parseInt(PropKit.get("redisport")), 0,
					PropKit.get("redispw"), 1);

		me.add(RedisPlugin);

		QuartzPlugin QuartzPlugin = new QuartzPlugin();
		me.add(QuartzPlugin);

		QuartzDynamicPlugin QuartzDynamicPlugin = new QuartzDynamicPlugin();
		me.add(QuartzDynamicPlugin);
	}
```

在springboot中修改为：

```java
@Bean    
   public ActiveRecordPlugin initActiveRecordPlugin() {


       druidPlugin = new DruidPlugin(url, username, password);
       // 加强数据库安全
       WallFilter wallFilter = new WallFilter();
       wallFilter.setDbType("mysql");
       druidPlugin.addFilter(wallFilter);
       // 添加 StatFilter 才会有统计数据
       // druidPlugin.addFilter(new StatFilter());
       // 必须手动调用start
       druidPlugin.start(); //important


       arp = new ActiveRecordPlugin(druidPlugin);
       arp.setTransactionLevel(Connection.TRANSACTION_READ_COMMITTED);
       _MappingKit.mapping(arp);
       arp.setShowSql(false);

       arp.getEngine().setSourceFactory(new ClassPathSourceFactory());
       //arp.addSqlTemplate("/sql/all_sqls.sql");
       // 必须手动调用start
       arp.start();

       redisPlugin = new RedisPlugin(redisName,
           redisHost,
           Integer.parseInt(redisPort), 0,
       redisPassword, Integer.parseInt(redisDatabase));
       redisPlugin.start();

       qdp = new QuartzDynamicPlugin();
       qdp.start();

       return arp;
   }
```

## 全局拦截器 configInterceptor -> WebMvcConfigurationSupport

涉及中文乱码问题

jfinal中的:
```java
/**
	 * 配置全局拦截器
	 */
	public void configInterceptor(Interceptors me) {
		me.add(new EncodingInterceptor());
		me.add(new ExceptionInterceptor());
		me.add(new AuthInterceptor());
	}
```

Springboot中：

```java
@Configuration
public class InterceptorConfig extends WebMvcConfigurationSupport{

	@Override
	protected void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new TestInterceptor())
				.addPathPatterns("/**")
				.excludePathPatterns("/error");
		registry.addInterceptor(new AuthInterceptor())
                .excludePathPatterns("/error");
		super.addInterceptors(registry);
	}

  /**
  * 中文乱码的解决方案
  */
  @Bean
    public HttpMessageConverter<String> responseBodyConverter() {
        StringHttpMessageConverter converter = new StringHttpMessageConverter(
                Charset.forName("UTF-8"));
        return converter;
    }

    /**
    * 中文乱码问题，json格式转换
    */
    @Override
    public void configureMessageConverters(
            List<HttpMessageConverter<?>> converters) {
        converters.add(responseBodyConverter());

      //1.需要定义一个convert转换消息的对象;
        FastJsonHttpMessageConverter fastJsonHttpMessageConverter = new FastJsonHttpMessageConverter();
        //2.添加fastJson的配置信息，比如：是否要格式化返回的json数据;
        FastJsonConfig fastJsonConfig = new FastJsonConfig();
        fastJsonConfig.setSerializerFeatures(SerializerFeature.PrettyFormat);
        //3处理中文乱码问题
        List<MediaType> fastMediaTypes = new ArrayList<>();
        fastMediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
        //4.在convert中添加配置信息.
        fastJsonHttpMessageConverter.setSupportedMediaTypes(fastMediaTypes);
        fastJsonHttpMessageConverter.setFastJsonConfig(fastJsonConfig);
        //5.将convert添加到converters当中.
        converters.add(fastJsonHttpMessageConverter);

        super.configureMessageConverters(converters);



    }

    @Override
    public void configureContentNegotiation(
            ContentNegotiationConfigurer configurer) {
        configurer.favorPathExtension(false);
    }
}
```

## configHandler -> ResponseEntityExceptionHandler/ResponseBodyAdvice

涉及到格式化输出，统一的异常处理。

jfinal中：

```java
/**
	 * 配置处理器
	 */
	public void configHandler(Handlers me) {
	}
```

springboot中：

```java
@RestControllerAdvice
public class GlobalResponseHandler extends ResponseEntityExceptionHandler implements ResponseBodyAdvice<Object> {

	@Value("${spring.profiles.active}")
	private String active;

	@Override
	public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
      //控制所支持的类型
		return true;
	}



	@Override
	public Object beforeBodyWrite(Object body, MethodParameter returnType, MediaType selectedContentType,
			Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request,
			ServerHttpResponse response) {
        //一般数据的格式化处理
    return body;
	}

	@ResponseStatus(HttpStatus.OK)
	@ExceptionHandler(MyException.class)
	public <T> GlobalResponse<T> handleException(HttpServletRequest request, MyException e) {
		  //格式化输出自定义异常
			return GlobalResponse.fail(e.getMessage());
		}

	}

	@ResponseStatus(HttpStatus.OK)
	@ExceptionHandler(Exception.class)
	@ResponseBody
	public <T> GlobalResponse<T> handleException(HttpServletRequest request, Exception e) {
      //格式化输出异常
			return GlobalResponse.fail("Error para");
	}

}
```

## 事件监听

例如jfinal中有onStart()、onStop()系统启动完成之后以及系统关闭之前分别回调这两个方法，springboot中支持更好, 并且springboot支持自定义事件

```java
@Configuration
public class ApplicationEventListener implements ApplicationListener<ApplicationEvent>{

	@Override
	public void onApplicationEvent(ApplicationEvent event) {
		// 在这里可以监听到Spring Boot的生命周期
        if (event instanceof ApplicationEnvironmentPreparedEvent) {
        	// 初始化环境变量
        	System.out.println("初始化环境变量");
        }
        else if (event instanceof ApplicationPreparedEvent) {
        	// 初始化完成
        	System.out.println("初始化完成");
        }
        else if (event instanceof ContextRefreshedEvent) {
        	// 应用刷新
        	System.out.println("应用刷新");
        }
        else if (event instanceof ApplicationReadyEvent) {
        	// 应用已启动完成
        	System.out.println("应用已启动完成");
        }
        else if (event instanceof ContextStartedEvent) {
        	// 应用启动，需要在代码动态添加监听器才可捕获
        	System.out.println("应用启动，需要在代码动态添加监听器才可捕获 ");
        }
        else if (event instanceof ContextStoppedEvent) {
        	// 应用停止
        	System.out.println("应用停止");
        	System.out.println("关闭数据库与redis连接");
            ActiveRecordPluginConfig.qdp.stop();
        	ActiveRecordPluginConfig.arp.stop();
        	ActiveRecordPluginConfig.druidPlugin.stop();
        	ActiveRecordPluginConfig.redisPlugin.stop();
        }
        else if (event instanceof ContextClosedEvent) {
        	// 应用关闭
        	System.out.println("应用关闭");
        	System.out.println("关闭数据库与redis连接");
            ActiveRecordPluginConfig.qdp.stop();
        	ActiveRecordPluginConfig.arp.stop();
        	ActiveRecordPluginConfig.druidPlugin.stop();
        	ActiveRecordPluginConfig.redisPlugin.stop();
        } else {
        	System.out.println("应用的其他操作");
        }
	}
}
```

## Controller 变更

注解@RestController/@Controller表示此类为Controller
RequestMapping注解标识访问路径和方法等

```java
@RestController
@RequestMapping("hello")
public class HelloController extends ControllerExt{
	/**
	 * 新增投票活动
	 */
   //访问路径: /hello/sayhi?para=...
	@RequestMapping("sayhi")
	public Object sayhi(String para){
        return "hello"
	}

```

## 日志配置

springboot默认的是logback，若替换为jfinal使用的logkit需要：

```xml
<!-- pom.xml -->
<!-- 去掉springboot自带的log框架 -->
<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
			<exclusions>
		        <exclusion>
		            <groupId>org.springframework.boot</groupId>
		            <artifactId>spring-boot-starter-logging</artifactId>
		        </exclusion>
		        <!-- <exclusion>
		        <groupId>org.slf4j</groupId>
		        <artifactId>slf4j-log4j12</artifactId>
		      </exclusion> -->
		    </exclusions>   
		</dependency>

    ...
    <!-- 添加日志框架 -->
    <dependency>
       			<groupId>log4j</groupId>
           		<artifactId>log4j</artifactId>
           		<version>1.2.16</version>
    	    </dependency>
    	    <dependency>
       			<groupId>slf4j-api</groupId>
           		<artifactId>slf4j-api</artifactId>
           		<version>1.7.21</version>
    	    </dependency>
    	    <dependency>
       			<groupId>slf4j-nop</groupId>
           		<artifactId>slf4j-nop</artifactId>
           		<version>1.7.21</version>
           		<scope>provided</scope>
    	    </dependency>

```

## 事务处理 @Before(Tx.class)

//自定义注解

参考链接 [JFinal ActiveRecordPlugin插件事物交给Spring管理](https://www.jianshu.com/p/090c8b6c1dca)

## 热部署配置方法

pom.xml配置热部署

```xml

  ...

<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-devtools</artifactId>
		<optional>true</optional>
</dependency>

  ...

<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
	               <fork>true</fork>
	            </configuration>
			</plugin>
		</plugins>
	</build>

  ...
```


## @Bean

- Spring容器管理的Java对象称之为Bean。
- 依赖注入其主要的作用，可以说就是维护Spring容器创建的Bean之间的依赖关系，简单来说就是一个bean（假定名为A）持有另一个Bean（假定名为B）的引用作为成员变量b，则由Spring容器自动将B赋值给A的成员变量b


## 定时任务

根据检索与尝试结果，springboot自带的定时任务功能可以较好的支持固定不变的定时任务，例如固定执行频率，固定执行频率+初次延迟，cron表达式

```java
//springboot自带的几种定时任务注解
@Scheduled(fixedRate = 1000)
@Scheduled(fixedDelay = 1000)
@Scheduled(fixedRate = 1000, initialDelay = 5000)
@Scheduled(cron = "[Seconds] [Minutes] [Hours] [Day of month] [Month] [Day of week] [Year]")
```

因此，动态定时任务需要结合Quartz插件。资料：[csdn博客](https://blog.csdn.net/haoxiaoyong1014/article/details/83339169)
