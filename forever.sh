#!/bin/bash
forever start -l $PWD/forever.logs -o app.logs -e error.logs -a -w --watchDirectory $PWD server.js
