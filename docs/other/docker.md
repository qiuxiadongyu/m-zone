# Docker

## Ubuntu 22.04下Docker安装

```
#安装前先卸载操作系统默认安装的docker，
sudo apt-get remove docker docker-engine docker.io containerd runc

#安装必要支持
sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
```

设置docker gpg key，设置更新apt源

```
#添加 Docker 官方 GPG key （可能国内现在访问会存在问题）
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 阿里源（推荐使用阿里的gpg KEY）
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

#添加 apt 源:
#Docker官方源
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

#阿里apt源
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

#更新源
sudo apt update
sudo apt-get update

```

安装Docker

```
#安装最新版本的Docker
sudo apt install docker-ce docker-ce-cli containerd.io
#等待安装完成

#查看Docker版本
sudo docker version

#查看Docker运行状态
sudo systemctl status docker

# 安装Docker命令补全工具
sudo apt-get install bash-completion

sudo curl -L https://raw.githubusercontent.com/docker/docker-ce/master/components/cli/contrib/completion/bash/docker -o /etc/bash_completion.d/docker.sh

source /etc/bash_completion.d/docker.sh

```

## docker相关操作：

带配置（挂载宿主机相关配置文件，需要宿主机原本有对应的目录和文件）创建启动

```
docker run \
-p 80:80 \
-p 443:443 \
--name nginx \
-v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
-v /home/nginx/conf/conf.d:/etc/nginx/conf.d \
-v /home/nginx/log:/var/log/nginx \
-v /home/nginx/html:/usr/share/nginx/html \
-d registry.cn-shenzhen.aliyuncs.com/amgs/nginx
```

```
docker run -p 80:80 -p 443:443 --name nginx -v /home/nginx/conf/nginx.conf:/etc/nginx/nginx.conf -v /home/nginx/conf/conf.d:/etc/nginx/conf.d -v /home/nginx/log:/var/log/nginx -v /home/nginx/html:/usr/share/nginx/html -d registry.cn-shenzhen.aliyuncs.com/amgs/nginx
```



进入docker容器

```
sudo docker exec -it eda2222(容器名orID) /bin/bash
```

退出docker命令：

```
exit
# 或者按Ctrl+P+Q
```

关闭删除容器

```
docker rm nginx
#直接执行docker rm nginx或者以容器id方式关闭容器
#找到nginx对应的容器id
docker ps -a
#关闭该容器
docker stop nginx
#删除该容器
docker rm nginx
#删除正在运行的nginx容器
docker rm -f nginx
```

查看镜像

```
docker images
```

删除镜像(此处df1为dockers images看到的所要删除镜像的`IMAGE ID`前三位)

```
docker rmi df1
```





## 制作镜像运行容器

这里以springboot打包出来的jar包使用docker创建容器运行为例

1. 在jar包的同级目录下创建名为Dockerfile文件，编写内容

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

   

2. 构建docker镜像(不要漏了最后的’.‘，表示 Dockerfile 所在的当前目录)

   ```
   docker build -t your-project-image:latest .
   ```

3. 运行刚才部署的容器

   ```
   docker run -d -p 8080:8080 --name your-project-container your-project-image:latest
   ```

   

## 将运行中的容器打成镜像：

```
docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
```

命令中的选项 `[OPTIONS]` 有如下候选：

| Option | 功能                           |
| ------ | ------------------------------ |
| -a     | 指定新镜像作者                 |
| -c     | 使用 Dockerfile 指令来创建镜像 |
| -m     | 提交生成镜像的说明信息         |
| -p     | 在 commit 时，将容器暂停       |

例子：

```
docker commit -a "nathan" -m "create new img" eda05ad514f8 consul:v0
```

命令以容器为基础生成新的镜像 consul:v0，镜像 id 为 



## 镜像打包

**镜像打包为 tar 文件**

```
docker save [OPTIONS] IMAGE [IMAGE...]
```

OPTIONS 选项只有 `-o` 用于指定输出到的文件

示例：

```
sudo docker save -o consul:v0.tar consul:v0
```

**从 tar 文件载入镜像**

```
docker load [OPTIONS]
```

OPTIONS 选项可选

1. `-i` 用于指定载入的镜像文件
2. `-q` 精简输出信息

示例：

```
sudo docker load -i consul:v0.tar
```

