# quickdata

## Tool to generate random data in csv form, built using node.js and vue.js.

### Skip to step 5 if you have git, sqlite3 and node installed. The rest of the instructions are OS agnostic.

1. Install [Node.js](https://nodejs.org/en/)
2. Install [SQLite3](https://sqlite.org/) by downloading the DLL(s) and putting it in C:\WINDOWS\system32
3. Install [Git](https://desktop.github.com/) for windows. For linux: `apt-get install git`
4. ** If on Windows, open the GitHub Desktop client and let it complete the Git installation, then open the Git Shell **
5. Make a directory for the project: `mkdir code` and move into the new folder: `cd ./code`
6. Clone project: `git clone https://github.com/capttrousers/quickdata.git`.
7. This will create a `quickdata` folder inside the `code` directory. Move into new project directory: `cd ./quickdata`.
8. Run `npm install` to install all dependencies / node modules and packages.
9. Run `npm run build` to make sure you have the latest build of the front end code.
10. (Optional) Run `npm run test` to run tests, but many of these will probablay fail unless you set up the db config.
11. Run project: `node ./server.js` and navigate to `localhost:8080` in a browser to see the quick data tool.


++++++++
  PROD
++++++++
$ ssh
$ cd to project
$ git pull
$ rm -rf node_modules // optional, hard reset
$ npm install
$ npm run build
$ pm2 list
$ pm2 restart appname