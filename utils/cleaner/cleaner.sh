#!/bin/bash
dir=$(dirname $(readlink -f $0));
printf "script directory is: $dir\n" >> $dir/dailyCleaner.logs;
cross-env DEBUG=models DEBUG_COLORS=true node $dir/TableCleaner.js >> $dir/dailyCleaner.logs 2>&1;
