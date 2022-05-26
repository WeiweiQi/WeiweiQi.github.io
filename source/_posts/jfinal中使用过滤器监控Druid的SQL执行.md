---
title: jfinal中使用过滤器监控Druid的SQL执行
comments: true
date: 2022-05-23 11:16:03
categories:
tags:
---

## 问题起源

最开始我想做的是通过拦截器拦截SQL执行，比如类似与PageHelper这种插件，通过拦截器或过滤器，手动修改SQL语句，以实现某些业务需求，比如执行分页，或者限制访问的数据权限等等。但是查到资料说过滤器不是干这个的，干这个的是数据库中间件干的事情，比如MyCat等。

但是经过测试发现，过滤器至少可以监听每一个SQL的执行与返回结果。因此，将这一次探索过程记录下来。

## 配置过滤器

在jfinal的启动配置类中，有一个函数`configPlugin(Plugins me)`函数来配置插件，这个函数会在jfinal启动时调用，这个函数的参数是`Plugins me`，这个参数是一个插件管理器，可以通过这个插件管理器来添加插件。

数据库插件Druid就是在该函数内添加的。

```java

public void configPlugin(Plugins me) {
    DruidPlugin druidPlugin = createDruidPlugin_holdoa();
    druidPlugin.setPublicKey(p.get("publicKeydebug").trim());
    wallFilter = new WallFilter();
    wallFilter.setDbType("mysql");
    druidPlugin_oa.addFilter(wallFilter);
    druidPlugin_oa.addFilter(new StatFilter());
    me.add(druidPlugin);
}

```

我们参考WallFilter以及StatFilter也创建一个过滤器类：


```java
import com.alibaba.druid.filter.FilterEventAdapter;
public class DataScopeFilter extends FilterEventAdapter {

}

```

我们发现FilterEventAdapter中的方法大概有这几个：

```java
public boolean statement_execute(FilterChain chain, StatementProxy statement, String sql) throws SQLException {...}
protected void statementExecuteUpdateBefore(StatementProxy statement, String sql) {...}
protected void statementExecuteUpdateAfter(StatementProxy statement, String sql, int updateCount) {...}
protected void statementExecuteQueryBefore(StatementProxy statement, String sql) {...}
protected void statementExecuteQueryAfter(StatementProxy statement, String sql, ResultSetProxy resultSet) {...}
protected void statementExecuteBefore(StatementProxy statement, String sql) {...}
protected void statementExecuteAfter(StatementProxy statement, String sql, boolean result) {...}
```

我们复写这几个方法来看一下（排除*Update*方法，因为我们更关心查询语句）

```java
package xxxx.xxxx;

import com.alibaba.druid.filter.FilterChain;
import com.alibaba.druid.filter.FilterEventAdapter;
import com.alibaba.druid.proxy.jdbc.ResultSetProxy;
import com.alibaba.druid.proxy.jdbc.StatementProxy;
import com.jfinal.kit.LogKit;
import java.sql.SQLException;

public class DataScopeFilter extends FilterEventAdapter {

    @Override
    public boolean statement_execute(FilterChain chain, StatementProxy statement, String sql) throws SQLException {
        LogKit.info("statement_execute");
        return super.statement_execute(chain, statement, sql);
    }

    @Override
    protected void statementExecuteQueryBefore(StatementProxy statement, String sql) {
        LogKit.info("statementExecuteQueryBefore");
        super.statementExecuteQueryBefore(statement, sql);
    }

    @Override
    protected void statementExecuteQueryAfter(StatementProxy statement, String sql, ResultSetProxy resultSet) {
        LogKit.info("statementExecuteQueryAfter");
        super.statementExecuteQueryAfter(statement, sql, resultSet);
    }

    @Override
    protected void statementExecuteBefore(StatementProxy statement, String sql) {
        LogKit.info("statementExecuteBefore");
        super.statementExecuteBefore(statement, sql);
    }

    @Override
    protected void statementExecuteAfter(StatementProxy statement, String sql, boolean result) {
        LogKit.info("statementExecuteAfter");
        super.statementExecuteAfter(statement, sql, result);
    }

    @Override
    public ResultSetProxy statement_executeQuery(FilterChain chain, StatementProxy statement, String sql)
            throws SQLException {
        LogKit.info("statement_executeQuery");
        return super.statement_executeQuery(chain, statement, sql);
    }
}

```

然后再config配置类中添加过滤器：

```java
druidPlugin.addFilter(new DataScopeFilter());
```

发起其执行顺序为：

```
statement_executeQuery
statementExecuteQueryBefore
statementExecuteQueryAfter
```

查看父级代码，发现其执行逻辑是，首先执行`statement_executeQuery`，然后因为调用父级的方法，而父级方法体为：

```java
@Override
    public ResultSetProxy statement_executeQuery(FilterChain chain, StatementProxy statement, String sql)
                                                                                                         throws SQLException {
        statementExecuteQueryBefore(statement, sql);

        try {
            ResultSetProxy resultSet = super.statement_executeQuery(chain, statement, sql);

            if (resultSet != null) {
                statementExecuteQueryAfter(statement, sql, resultSet);
                resultSetOpenAfter(resultSet);
            }

            return resultSet;
        } catch (SQLException error) {
            statement_executeErrorAfter(statement, sql, error);
            throw error;
        } catch (RuntimeException error) {
            statement_executeErrorAfter(statement, sql, error);
            throw error;
        } catch (Error error) {
            statement_executeErrorAfter(statement, sql, error);
            throw error;
        }
    }
```

从而进一步触发`statementExecuteQueryBefore`方法与`statementExecuteQueryAfter`方法。

因此我们，修改`statement_executeQuery`方法：

```java
 @Override
    public ResultSetProxy statement_executeQuery(FilterChain chain, StatementProxy statement, String sql)
            throws SQLException {

        statementExecuteQueryBefore(statement, sql);
        ResultSetProxy result = chain.statement_executeQuery(statement, sql);
        statementExecuteQueryAfter(statement, sql, result);
        return result;
    }
```

如此，便让输出结果为：

```
statementExecuteQueryBefore
statement_executeQuery
statementExecuteQueryAfter
```

我们可以在Before或者After方法中添加一些逻辑，比如：记录SQL的实际执行人，操作时间，请求执行SQL的接口。


## sql被声明为final类型

发现执行的SQL在Druid中对应的类是：`DruidPooledPreparedStatement`，其类结构为：

```java
public class DruidPooledPreparedStatement extends DruidPooledStatement implements PreparedStatement {

    private final static Log              LOG = LogFactory.getLog(DruidPooledPreparedStatement.class);

    private final PreparedStatementHolder holder;
    private final PreparedStatement       stmt;
    private final String                  sql;

    ....
}
```

这也就以为着，该类一旦创建，SQL设置后就不允许再修改了，因此，我们需要修改SQL的话，就需要在prepared对象生成之前就修改到对应的执行SQL。

在调试过程中，发现需要覆盖下面这个方法：


```java
@Override
    public PreparedStatementProxy connection_prepareStatement(FilterChain chain, ConnectionProxy connection, String sql)
            throws SQLException {
        // 可以达到修改SQL的目的
        sql += " LIMIT 1";
        PreparedStatementProxy statement = super.connection_prepareStatement(chain, connection, sql);

        statementPrepareAfter(statement);

        return statement;
    }
```

我们可以在这里添加自定义的SQL修改逻辑，比如添加数据权限等等。






