#!/bin/bash
# chmod u+x filename
# ./ThisFileName.sh

echo "Script is running..."
kill -9 $(lsof -t -i:3000 -sTCP:LISTEN)
echo "after kill -9 at port 3000"


echo ""
echo "listing what is at port 3000"
lsof -i :3000

echo "Script finished successfully"