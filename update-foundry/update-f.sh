#/bin/bash

pm2 stop foundry
node ./update-foundry.js "$1"
pm2 start foundry