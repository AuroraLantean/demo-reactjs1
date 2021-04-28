#!/bin/bash
# chmod u+x filename
# ./ThisFileName.sh

echo "Script is running..."
kill -9 $(lsof -t -i:3000 -sTCP:LISTEN)
echo "after kill -9 at port 3000"
sleep 1
lsof -i :3000
echo "after listing what is at port 3000"
sleep 1
yarn run dev
echo "starting the app..."
echo "Script finished successfully"