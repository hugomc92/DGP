# Neccessary Instalations

Change DB conexions in `config.json` if neccesary

```
{
  "db":{
#   "host": "192.168.1.60", --> remove this line (or any IP)
    "host": "hugomaldonado.ddns.net",
    ...
  },
  ...
```

## NodeJS + NPM

```
# Linux
$ sudo apt-get update
$ sudo apt-get install nodejs npm nodejs-legacy nodejs-dev
$ sudo npm install -g grunt-cli

# OS X
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew update
$ brew doctor
$ export PATH="/usr/local/bin:$PATH"
$ brew install node
$ npm install -g grunt-cli
```

## Directories structure -> NEED TO TRANSLATE

- **/config**: App Configuracion
- **/controllers**: Controllers, paths and logic of the aplication, APIREST as well.
- **/db**: Data Base exportations to backups.
- **/locales**: Language packet.
- **/log**: System logs.
- **/models**: Data Models (ORM)
- **/lib**: Libs to be used in the inside part of server.
- **/public**: Public web resources (js, css, fonts, img, less).
- **/public/static/templates**: Template to be rendered.
- **/public/static/*/lib**: Libs to be used in public part of server (js, css…).
- **/service**: Map from Models to Services offered by the APIREST.
- **/tasks**: Automatized task of Grunt and scripts bash.
- **/tests**: Unit and funtional test.
- **/utils**: Utilities for example, DB Conection...
- **main.js**: App Start Point.


## Install dependencies from `package.json`

```
$ npm install
```

## Execute grunt

Exect grunt as a service `grunt` to live reload on any change on any file.

```
$ grunt
```

## If error [nodemon] Internal watch failed: watch ........ ENOSPC
Fix it introducing this command:

```
$ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```

## Execute grunt in background

0. Check if a `screen` session is running attaching it

```
$ screen -r
```

1. Launch a new session in `screen` command

```
$ screen -S grunt
```

2. Execute command to be executed in background

```
$ grunt
```

3. Detach `screen` from terminal (to still run in background)

Press `Ctrl` + `a` + `d`

4. Close terminal

5. To reattach the last screen session

```
$ screen -r
```

## References

- [DatePicker](http://amsul.ca/pickadate.js/)
- [Sessions Express](https://github.com/expressjs/session)
- [Sessions Express Guia de Firefox](https://github.com/mozilla/node-client-sessions)
- [Good Practices Express JS](https://expressjs.com/en/advanced/best-practice-performance.html)
- [EJS](http://ejs.co)
