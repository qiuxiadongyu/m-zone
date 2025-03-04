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



配置nginx.conf：此时nginx容器中的nginx.conf挂载对应到/home/nginx/conf/nginx.conf，直接修改服务器下的/home/nginx/conf/nginx.conf

```
# 全局配置块：设置Nginx工作模式和性能参数
# user  root;    # 运行用户（建议与系统权限一致）
worker_processes  auto;  # 自动根据CPU核心数分配工作进程
error_log  /var/log/nginx/error.log warn;  # 错误日志路径和级别
pid        /var/run/nginx.pid;            # 进程PID文件路径

# 事件模块：配置连接处理机制
events {
    worker_connections  1024;  # 单个工作进程的最大并发连接数
    multi_accept        on;    # 允许一次性接受所有新连接
}

# HTTP模块：定义HTTP服务器行为
http {
    # 基础参数
    include       /etc/nginx/mime.types;  # 包含MIME类型定义文件
    default_type  application/octet-stream;  # 默认响应类型
    sendfile      on;          # 启用高效文件传输模式
    tcp_nopush    on;          # 减少网络报文段数量
    keepalive_timeout  65;     # 保持连接的超时时间（秒）

    # 日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;  # 访问日志路径和格式

    # gzip 压缩
    # gzip on;
    # gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # http 服务器块
    server {
        listen       80;       # 监听端口（HTTP默认端口）
        server_name  clay-zone.online www.clay-zone.online;  # 域名或IP地址

        # 根目录和默认文件
        root   /usr/share/nginx/html;  # 网站根目录
        index  index.html index.htm;  # 默认索引文件

        # 静态文件处理
        location / {
            try_files $uri $uri/ =404;  # 尝试按顺序匹配文件或目录
            expires 10d;  # 静态文件缓存 10 天
        }

        # 错误页面配置
        error_page  404  /404.html;
        error_page  500 502 503 504  /50x.html;

        # 反向代理示例（将请求转发到后端服务）
        location /NapCat/ {
            proxy_pass         http://localhost:6099/webui/network;  # 后端服务地址
            proxy_set_header   Host $host;
            proxy_set_header   X-Real-IP $remote_addr;
        }
    }

    # HTTPS 服务器块
    # server {
    #     listen       443 ssl;
    #     server_name  clay-zone.online www.clay-zone.online;

    #     ssl_certificate      /etc/nginx/ssl/clay-zone.online.crt;
    #     ssl_certificate_key  /etc/nginx/ssl/clay-zone.online.key;

    #     ssl_protocols        TLSv1.2 TLSv1.3;
    #     ssl_ciphers          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    #     ssl_prefer_server_ciphers on;
    #     ssl_session_cache    shared:SSL:10m;
    #     ssl_session_timeout  10m;

    #     root   /var/www/html;
    #     index  index.html index.htm;

    #     location / {
    #         try_files $uri $uri/ =404;
    #         expires 10d;
    #     }

    #     error_page  404  /404.html;
    #     error_page  500 502 503 504  /50x.html;

    #     location /NapCat/ {
    #         proxy_pass         http://localhost:6099/webui/network;
    #         proxy_set_header   Host $host;
    #         proxy_set_header   X-Real-IP $remote_addr;
    #         proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    #         proxy_set_header   X-Forwarded-Proto $scheme;
    #     }
    # }

    # 可添加更多server块以支持多站点
}
```

## 直接安装

直接安装的方法就暂时就不赘述了

## 相关知识

sudo systemctl start/restart/enable/stop nginx



`^~` 修饰符用于前缀匹配，当一个 `location` 块使用了 `^~` 修饰符时，表示如果请求的 URI 以该 `location` 块指定的前缀开头，Nginx 会立即停止对后续 `location` 块的正则表达式匹配检查，直接使用该 `location` 块来处理请求。



### 不需要使用 `rewrite` 的情况

#### 1. 仅进行简单的反向代理

```
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://backend_server;
    }
}
```



如果只是将客户端的请求简单地转发到后端服务器，并且不需要对请求的 URI 进行修改，那么就不需要使用 `rewrite` 指令。

#### 2. 多层代理仅做端口或 IP 转发

```
# 第一层代理
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://second_proxy_server;
    }
}

# 第二层代理
server {
    listen 8080;
    server_name second_proxy_server;

    location / {
        proxy_pass http://backend_server;
    }
}
```



当多层 Nginx 代理只是将请求从一个端口或 IP 转发到另一个端口或 IP，而不改变请求的路径时，也不需要 `rewrite`。

### 需要使用 `rewrite` 的情况

#### 1. 修改请求 URI

```
server {
    listen 80;
    server_name example.com;

    location /old_path/ {
        rewrite ^/old_path/(.*)$ /new_path/$1 break;
        proxy_pass http://backend_server;
    }
}
```



如果在多层代理过程中需要对请求的 URI 进行修改，例如去除、添加或替换部分路径，就需要使用 `rewrite` 指令。

#### 2. 实现 URL 重定向

```
server {
    listen 80;
    server_name example.com;

    if ($http_user_agent ~* "mobile") {
        rewrite ^(.*)$ http://m.example.com$1 permanent;
    }

    location / {
        proxy_pass http://backend_server;
    }
}
```



在多层代理中，如果需要根据某些条件将请求重定向到其他 URL，也可以使用 `rewrite` 指令。

### 1. URL 规范化

#### 去除多余的斜杠



在处理用户输入的 URL 时，可能会出现多余的斜杠，为了保持 URL 的一致性，可使用 `rewrite` 去除多余斜杠。

```nginx
server {
    listen 80;
    server_name example.com;

    rewrite ^/(.*)//(.*)$ /$1/$2 permanent;
    location / {
        # 其他配置
    }
}
```

#### 统一大小写



为了避免因大小写不同而导致的资源重复，可将所有请求的 URL 转换为小写或大写。

```nginx
server {
    listen 80;
    server_name example.com;

    if ($request_uri ~* [A-Z]) {
        rewrite ^(.*)$ $1 last;
    }
    location / {
        # 其他配置
    }
}
```

### 2. 实现 URL 重定向

#### 永久重定向（301）



当网站的 URL 结构发生永久性改变时，为了保证搜索引擎收录和用户体验，需要将旧的 URL 永久重定向到新的 URL。

```nginx
server {
    listen 80;
    server_name old.example.com;
    rewrite ^/(.*)$ http://new.example.com/$1 permanent;
}
```

#### 临时重定向（302）



在网站进行临时维护或测试时，可将用户临时重定向到其他页面。

```nginx
server {
    listen 80;
    server_name example.com;
    if ($date_local ~ "^(Mon|Tue|Wed|Thu|Fri)") {
        rewrite ^(.*)$ http://temp.example.com/$1 redirect;
    }
    location / {
        # 正常业务配置
    }
}
```

### 3. 隐藏真实的文件路径



为了提高网站的安全性和可维护性，可使用 `rewrite` 隐藏真实的文件路径，对外提供友好的 URL。

```nginx
server {
    listen 80;
    server_name example.com;

    location /products/ {
        rewrite ^/products/([0-9]+)$ /product_detail.php?id=$1 last;
    }
}
```



在这个例子中，用户访问 `http://example.com/products/123` 时，实际上会被重定向到 `http://example.com/product_detail.php?id=123`。

### 4. 多版本网站切换



根据用户的设备类型、语言偏好等条件，将用户重定向到不同版本的网站。

#### 根据设备类型切换

```nginx
server {
    listen 80;
    server_name example.com;

    if ($http_user_agent ~* "mobile") {
        rewrite ^(.*)$ http://m.example.com$1 permanent;
    }
    location / {
        # 桌面版网站配置
    }
}
```