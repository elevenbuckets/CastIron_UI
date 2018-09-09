const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const ipfs_go  = require('ipfs_base/IPFS_GO.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let ipfs;

function createWindow () {
  let cfgobj = fs.readFileSync('.local/default.json');
  let ipfscfg = path.join(cfgobj.configDir, 'ipfsserv.json');
  
  ipfs  = new ipfs_go(ipfscfg);
  // Create the browser window.
  ipfs.start().then((API) => {
    win = new BrowserWindow({minWidth: 1280, minHeight: 960, resizable: true, icon: path.join(__dirname, 'public', 'assets', 'icon', '11be_logo.png')});
    win.setMenu(null);
  
    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, '/public/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  
    global.ipfs  = ipfs;

    // Open the DevTools.
    win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Whole process reloader via ipcRenderer for config reload
ipcMain.on('reload', (e, args) => {
	app.relaunch();
	app.exit();	
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
