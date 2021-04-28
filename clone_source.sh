#!/bin/bash
# chmod u+x filename
# ./ThisFileName.sh

filenamePrefix=cloneA
FILENAME=$filenamePrefix.tar.gz    # Here i define Backup file name format.

echo "the script is running..."

tar -cpzf ./$FILENAME ./* --exclude=*.gz --exclude=*.zip --exclude=*.next --exclude=node* --exclude=*.lock
#tar -cpzf $dBackup/$FILENAME "$HOME"/.bashrc "$s1"/*.* --exclude=*.mp4 --exclude=*.xz --exclude=*.zip --exclude=*.gz

echo "Script finished successfully"