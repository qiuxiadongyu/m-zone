# Nginx

> 本文主要介绍了Docker的安装步骤，包括如何从官方镜像仓库下载Nginx镜像，如何检查已下载的镜像。接着，讲解了创建Nginx配置文件的必要性，并提供了创建挂载目录的命令。然后，展示了如何创建并运行Nginx容器，包括端口映射、配置文件挂载和日志目录设置。最后，提到了如何重启容器以应用修改，并给出了结果检测的方法。
> 
>

## Docker 安装 Nginx 容器 

拉取nginx镜像

```
docker pull nginx
# 国内阿里源
docker pull registry.cn-shenzhen.aliyuncs.com/amgs/nginx:latest
```

检查docker镜像：

```
docker images
```

在服务器上创建对应的配置文件

```
# 创建挂载目录
mkdir -p /home/nginx/conf
mkdir -p /home/nginx/conf/conf.d
mkdir -p /home/nginx/log
mkdir -p /home/nginx/html

#容器中的nginx.conf文件和conf.d文件夹复制到宿主机
#生成容器
docker run --name nginx -p 9001:80 -d nginx
#将容器nginx.conf文件复制到宿主机
docker cp nginx:/etc/nginx/nginx.conf /home/nginx/conf/nginx.conf
#将容器conf.d文件夹下内容复制到宿主机
docker cp nginx:/etc/nginx/conf.d /home/nginx/conf/conf.d
#将容器中的html文件夹复制到宿主机
docker cp nginx:/usr/share/nginx/html /home/nginx/
```



带配置（挂载宿主机相关配置文件，需要宿主机原本有对应的目录和文件）创建启动docker容器

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

