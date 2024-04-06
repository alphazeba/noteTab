#!/bin/zsh
PROJ_DIR=$(pwd)
echo building all...
echo building client
cd $PROJ_DIR/client
npm install
npm run build
echo building server
cd $PROJ_DIR/server
cargo build