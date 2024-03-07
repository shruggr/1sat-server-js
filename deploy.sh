#!/bin/bash
echo "Git pull latest ..."
git pull --rebase
echo "Building ..."
npm run build
echo "Stop  1sat-server ..."
pm2 stop 1sat-server
echo "Start 1sat-server ..."
pm2 start ./dist/server.js --name 1sat-server --log output.log