#!/bin/bash
pwd=$(dirname $(readlink -f $0));
/home/sam/.nvm/versions/node/v7.4.0/bin/node $pwd/TableCleaner.js >> $pwd/dailyCleaner.logs;
