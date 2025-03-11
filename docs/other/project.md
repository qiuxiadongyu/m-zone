

# 项目相关





## 容器部署

在项目中有使用docker或部署项目的时候，可以基于nginx的镜像，在其基础上制作新的镜像方便部署

实例：（dockerfile）

以下是一个前端项目的实例，通过在前端项目打包后将对应的静态资源部署到nginx对应的html中

```
FROM nginx:latest
# 可以在项目中维护有关nginx的部分
COPY ci/default.conf /etc/nginx/conf.d/default.conf
COPY ./dist-test /usr/share/nginx/html/uappadmin
COPY ci/40x.html /usr/share/nginx/html/40x.html
```

后端的话则直接部署配置好对应的端口映射即可，如：

```
# 使用基于 JDK 17 的官方 OpenJDK 镜像作为基础镜像
FROM openjdk:17

# 设置工作目录
WORKDIR /app

# 将打包好的 JAR 文件复制到工作目录
COPY your-project.jar /app/your-project.jar

# 暴露 Spring Boot 应用默认的端口，根据实际情况修改
EXPOSE 8080

# 定义启动命令
CMD ["java", "-jar", "your-project.jar"]
```

