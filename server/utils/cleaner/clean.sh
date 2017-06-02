#!/bin/bash
# this file needs to be run from the root of the project
# ./server/utils/cleaner/clean.sh
# set up as cron job to run daily

# need to test exactly how to set up the cron job to make this run appropriately
# for example, when grabbing the models module, in TableCleaner.js and processTables.js, where does the sqlite.db get created?

# on the prod vm, the cron job is @daily /full/path/to/clean.sh
# check on home machine to compare


# to get directory path of where script is located
# same dir as table cleaner service
dir=$(dirname $(readlink -f $0));

# need to figure out way to turn on debug logs in winston
# cross-env DEBUG=models DEBUG_COLORS=true
# cross-env NODE_TESTING=true
node $dir/init.cleaner.js
