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



此时nginx容器中的nginx.conf挂载对应到/home/nginx/conf/nginx.conf，直接修改服务器下的/home/nginx/conf/nginx.conf

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
        root   /var/www/html;  # 网站根目录
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

