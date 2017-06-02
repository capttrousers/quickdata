#!/bin/bash
# this file needs to be run from the root of the project
# ./utils/cleaner/clean.sh
# set up as cron job to run daily

# to get directory path of where script is located
# same dir as table cleaner service
dir=$(dirname $(readlink -f $0));

# need to figure out way to turn on debug logs in winston
# cross-env DEBUG=models DEBUG_COLORS=true
# cross-env NODE_TESTING=true
node $dir/init.cleaner.js
