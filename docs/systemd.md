# Set up systemd to autostart your app

Systemd is a service on most Linux systems. You can use it auto-start your apps when your server is restarted.

**Create a systemd file using your domain name.**  
`nano /etc/systemd/system/mydomain.service`

**Paste the following contents**  
- 'Description' can be your domain name  
- 'Environment=NODE_PORT' should match the proxy port if you are using NGINX. Otherwise you can remove this variable.  
- 'WorkingDirectory' is the directory of your app.
- 'ExecStart' is the path-to-npm + the command ' run start'. To find the `npm` path on your server, you can type `which npm`

mydomain.service
```
[Unit]
Description=mydomain
After=network.target

[Service]
User=root
Group=root
Environment=NODE_PORT=3000
Type=simple
WorkingDirectory=/var/www/myApp
ExecStart=/root/.nvm/versions/node/v14.16.1/bin/npm run start

Restart=always

[Install]
WantedBy=multi-user.target
```

**Reload systemd**  
`systemctl daemon-reload`  

**Enable the service on system boot**  
`systemctl enable mydomain`  

**Run the service**  
`systemctl start mydomain`  
