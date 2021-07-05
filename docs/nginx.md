
```
# Official English Documentation: http://nginx.org/en/docs/
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
  worker_connections 1024;
}

http {
  map_hash_bucket_size 128;
  include             /etc/nginx/mime.types;
  default_type        application/octet-stream;

  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

  access_log  /var/log/nginx/access.log  main;

  sendfile             on;
  tcp_nopush           on;
  tcp_nodelay          on;
  keepalive_timeout    65;
  types_hash_max_size  2048;
  # Increase max file upload size
  client_max_body_size 100M;

  # Remove nginx version from server header banner
  server_tokens  off;

  # Include sub-domain config files from the /etc/nginx/conf.d directory.
  # This also includes error-status-vars.conf which is used for error pages
  include /etc/nginx/conf.d/*.conf;

  # Expires
  map $sent_http_content_type $expires {
    "text/html"                 epoch;
    "text/html; charset=utf-8"  epoch;
    default                     off;
  }

  server {
    listen 443       ssl http2 default_server;
    listen [::]:443  ssl http2 default_server;
    server_name       _;
    root             /var/www/home;

    ssl_certificate      /etc/letsencrypt/olbworld.org/fullchain.pem;
    ssl_certificate_key  /etc/letsencrypt/olbworld.org/private.key;

    # Disable weak SSL protocols
    ssl_protocols  TLSv1.2;

    # Disable weak cipher suites
    ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 $
    ssl_prefer_server_ciphers  on;

    # Remove nginx version from server header banner
    server_tokens off;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    gzip             on;
    gzip_types       text/plain application/xml text/css application/javascript;
    gzip_min_length  1000;

    location / {
      expires                             $expires;
      proxy_redirect                      off;
      proxy_set_header Host               $host;
      proxy_set_header X-Real-IP          $remote_addr;
      proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto  $scheme;
      proxy_read_timeout                  1m;
      proxy_connect_timeout               1m;
      proxy_pass                          http://localhost:3040;
    }

    error_page 400 401 402 403 404 405 406 407 408 409 410 411 412 413 414 415 416 417 418 421 422 423 424 426 428 429 431 451 500 501 502 503 $

    location ~ ^/errors.html {
      ssi         on;
      internal;
      auth_basic  off;
      root        /etc/nginx;
    }
  }

  # redirect all http to https
  server {
    listen 80       default_server;
    listen [::]:80  default_server;
    server_name     _;
    return 301      https://$host$request_uri;
  }
}
```

