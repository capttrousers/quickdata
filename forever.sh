#!/bin/bash
forever start -l /home/sam/dev/webdev/quickData/webpack-express/forever.logs -a -w --watchIgnore *.logs --watchIgnore dist/ --watchIgnore *.csv --watchIgnore node_modules/ --watchDirectory /home/sam/dev/webdev/quickData/webpack-express server.sh
