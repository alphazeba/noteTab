# Note Tab
This is a simple webapp designed to be hosted locally and used alongside [tree style tabs](https://github.com/piroor/treestyletab).
The primary purpose of this tool is to function as a nameable placeholder in treestyle tabs for use as folders of open tabs.

![folder view](/z_demo/folderView.png)

However, you can also take notes on the tabs themselves.

![note tab page](/z_demo/noteTabPage.png)

There is no save button, they will save automatically after a few seconds.  Double click the x icon to delete the current NoteTab.

# setup environment
## 1. install node. 
https://github.com/nvm-sh/nvm#installing-and-updating

I would suggest using nvm.
this has been tested with many versions of node, I am currently using v20.11.0
```
nvm install v20.11.0
nvm use v20.11.0
```
## 2. install rust
https://www.rust-lang.org/tools/install


## 3. prep noteTab directory
```
mkdir -p ~/.notetab/tabs
```

## 4. config
you can configure the address and port used in `rocket.toml`.

# build
If you have done the above steps you should simply have to run
```
./build.sh
./run.sh
```