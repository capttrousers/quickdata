#!/bin/bash
dir=$(dirname $(readlink -f $0));
# need to figure out way to turn on debug logs in winston
# cross-env DEBUG=models DEBUG_COLORS=true
cross-env NODE_ENV=test node $dir/init.cleaner.js
