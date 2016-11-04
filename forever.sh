#!/bin/bash
if [ "$NODE_ENV" = "production" ]; then
  export NODE_ENV=development
  echo "$NODE_ENV"
fi
forever start -l $PWD/forever.logs -o app.logs -e error.logs -a -w --watchDirectory $PWD server.js
