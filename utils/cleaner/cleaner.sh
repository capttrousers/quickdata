#!/bin/bash
pwd=$(dirname $(readlink -f $0));
printf "$pwd\n";
node $pwd/TableCleaner.js >> $pwd/dailyCleaner.logs;
