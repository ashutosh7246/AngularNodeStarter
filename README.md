Prerequists:(All commands are for Debian Linux. May need changes in other OS)

Apache2
2. sudo apt-get update
3. sudo apt-get install apache2

GIT - If Git no installed
1. sudo apt-get install git

Node and nvm

1. sudo apt-get update
2. sudo apt-get install build-essential libssl-dev
3. curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh -o install_nvm.sh
4. nano install_nvm.sh
5. bash install_nvm.sh
6. source ~/.profile
7. nvm ls-remote
8. nvm install 8.9.2
9. nvm use 8.9.2
10. node -v

PM2
1. sudo npm install -g pm2

Redis Pub Sub
1. Install redis-server on system: sudo apt install redis-server
    for MAC follow instruction given here: https://redis.io/download
2. Start redis-server: redis-server

To active schedular add following environment variable under 'env' object in pm2 json file
- "WITH_SCHEDULE": true

Steps to generate CSR using OpenSSL.
1. Run this command in terminal:
    openssl req -new -newkey rsa:2048 -nodes -keyout stoyl.key -out stoyl.csr
2. Provide following details:
    Country Name (2 letter code)
    State or Province Name (full name) [Some-State]
    Locality Name (eg, city)
    Organization Name (eg, company)
    Organizational Unit Name (eg, section)
    Common Name (e.g. server FQDN or YOUR name) (FQDN: fully qualified domain name)
    Email Address
    A challenge password
    An optional company name
3. Two files with names 'stoyl.csr' and 'stoyl.key' will be generated

Steps to disable HTTPS(server only):
1. Start both server(customer and brain) without using *pm2-start-secure.json* file
2. Manually Change protocol from https to http to *custHost* and *brainHost* constant on both client(customer and brain)

Steps to Enable HTTPS(server only):
1. Start both server(customer and brain) using *pm2-start-secure.json* file
2. Manually Change protocol from http to https to *custHost* and *brainHost* constant on both client(customer and brain)
3. You may need add security exceptions. To do that follow *Steps to add security exception for HTTPS*

Stpes to add security excpetion for HTTPS:
1. Open browser and run URL of customer server (eg. https://localhost:3000 - assuming customer server is running on localhost with port 3000);
2. You will see browser specific screen to add exception.
3. Add security exception by proceeding steps on screen.
4. Do same for brain server
