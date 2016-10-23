#!/bin/bash

# update npm
sudp npm install npm@latest -g

# update all packages
npm update

# update nodejs
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
node -v
