

# QQ机器人

参考[NapCatQQ+Springboot基于onebot协议实现qq机器人-CSDN博客](https://blog.csdn.net/changwenpeng/article/details/144649045)

## 连接消息平台

常见消息平台以及代理机器人： napcat、go-cqhttp

这边使用**napcat**

### window上本地测试部署

1. 前往 [NapCatQQ 的 release 页面](https://github.com/NapNeko/NapCatQQ/releases) 下载NapCat.Shell.zip解压（直接安装无头版本）
2.  需要电脑上曾经登录过对应的qq，然后启动napcat.bat，扫码登录（如果普通cmd处的二维码扫不了，可以直接在文件路径处输入powershell，在powershell中打开当前文件再执行.\napcat.bat）
3. 在服务窗口处可以看到[NapCat] [WebUi] WebUi Local Panel Url: http://127.0.0.1:6099/webui?token=xxxx，在浏览器中复制 http://127.0.0.1:6099/webui打开，"token=xxxx"处的xxxx为token，之后有用
4. 网络配置：在 http://127.0.0.1:6099/webui处左侧点击网络配置，新建websocket客户端或反向websocket服务，输入名称（自己起），url（服务地址，这里先设置ws://localhost:8081/ws/shiro，后续后端服务开发以这个地址开发），token（上一步中的token）

### 服务器上部署



## 后端服务部分（简单实现）

后端使用Shiro 基于OneBot协议的QQ机器人开发框架

相关项目：[MisakaTAT/Shiro: 基于OneBot协议的QQ机器人快速开发框架](https://github.com/MisakaTAT/Shiro)

>- `v2` 版本开始仅支持 `JDK 17+` 与 `SpringBoot 3.0.0+`
>- 客户端需要支持 `websocket reverse` 即反向 `websocket` 连接

**首先创建一个空的 `SpringBoot` 项目**

**配置pom依赖：**

```xml
<!-- 导入Maven依赖 -->
<dependency>
    <groupId>com.mikuac</groupId>
    <artifactId>shiro</artifactId>
    <!-- 请使用最新版本，测试时最新的是2.3.5 -->
    <version>2.3.5</version>
</dependency>
```

**修改resources里的application.yml**

```yml
shiro:
  ws:
    server:
      enable: true
      url: "/ws/shiro"

  plugin-list:
  	# 这里的路径是后面新建的组件路径
    - com.example.testdemo02.plugin.TestPlugin
```

**新建组件：TestPlugin**

```java
package com.example.testdemo02.plugin;

import com.mikuac.shiro.common.utils.MsgUtils;
import com.mikuac.shiro.core.Bot;
import com.mikuac.shiro.core.BotPlugin;
import com.mikuac.shiro.dto.event.message.GroupMessageEvent;
import com.mikuac.shiro.dto.event.message.PrivateMessageEvent;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class TestPlugin extends BotPlugin {

    private static final Logger logger = LoggerFactory.getLogger(TestPlugin.class);

    public TestPlugin() {
        try {
            // 初始化代码
        } catch (Exception e) {
            logger.error("TestPlugin 初始化失败", e);
        }
    }
    @Override
    public int onPrivateMessage(Bot bot, PrivateMessageEvent event) {
        if ("hello".equals(event.getMessage())) {
            // 构建消息
            String sendMsg = MsgUtils.builder()
                    .at(event.getUserId())
                    .text("hello, this is napcatdemo plugin.")
                    .build();
            bot.sendPrivateMsg(event.getUserId(), sendMsg, false);
        }
        // 返回 MESSAGE_IGNORE 执行 plugin-list 下一个插件，返回 MESSAGE_BLOCK 则不执行下一个插件
        return MESSAGE_IGNORE;
    }

    @Override
    public int onGroupMessage(Bot bot, GroupMessageEvent event) {
        if ("hello".equals(event.getMessage())) {
            // 构建消息
            String sendMsg = MsgUtils.builder()
                    .at(event.getUserId())
                    .text("hello, this is napcatdemo plugin.")
                    .build();
            // 发送群消息
            bot.sendGroupMsg(event.getGroupId(), sendMsg, false);
        }

        // 返回 MESSAGE_IGNORE 执行 plugin-list 下一个插件，返回 MESSAGE_BLOCK 则不执行下一个插件
        return MESSAGE_IGNORE;
    }
    
}
```

**启动项目**

可以看到输出中有Account 2123xxxxxx connected（2123xxxxxx 为对应的对应qq机器人登录的qq号码）则说明启动并连接成功



这是给小号发信息“hello”，可以看到小号会自动回复"hello, this is napcatdemo plugin."





## 机器人完善

### 问答聊天 TODO

### 图片生成 TODO

### 查找 TODO



> 以后可能会做的功能：
>
> \-  资源出处查找
>
> \-  上下文历史记录
>
> \-  群聊问题实现

