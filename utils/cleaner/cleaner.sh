#!/bin/bash

# to be set to executable:
# $ chmod +x cleaner.sh
# then set up as daily cron job:
# $ crontab -e
# | @daily /path/to/cleaner.sh
pwd=$(dirname "$(readlink -f "$0")");
printf "\n" >> $pwd/TableCleaner.logs;
echo $(date) >> $pwd/TableCleaner.logs;
node $pwd/TableCleaner.js >> $pwd/TableCleaner.logs;
