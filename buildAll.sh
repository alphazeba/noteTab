#!/bin/zsh
PROJ_DIR=$HOME/Projects/noteTab
OLD_DIR=$(pwd)
echo building all...
echo building client
cd $PROJ_DIR/client
npm run build
echo building server
cd $PROJ_DIR/server
cargo run
echo done
cd $OLD_DIR
