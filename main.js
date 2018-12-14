'use strict';

const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')
const cluster = require('cluster');
const flatIron = require('bladeiron_api');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const loadConfig = (path) => 
{
	let buffer = fs.readFileSync(path);
	return JSON.parse(buffer.toString());
}

const bladeWorker = (rootcfg) => 
{
	let gethcfg = rootcfg.configDir !== '' ? loadConfig(path.join(rootcfg.configDir, 'config.json')) : {};
	let ipfscfg = rootcfg.configDir !== '' ? loadConfig(path.join(rootcfg.configDir, 'ipfsserv.json')) : {};
	let cfgObjs = {geth: gethcfg, ipfs: ipfscfg};
	let rpcport = gethcfg.rpcport || 3000;
	let rpchost = gethcfg.rpchost || '127.0.0.1';
	let fiapi   = null 
	let worker  = null;

	console.log(JSON.stringify(cfgObjs,0,2));

	if (rootcfg.configDir !== '') {
		fiapi = new flatIron(rpcport, rpchost, {
			"appName": "__MAIN__",
			"artifactDir": __dirname,
			"conditionDir": __dirname,
			"contracts": [],
			"networkID": gethcfg.networkID,
			"version": "1.0"
		});

		worker = cluster.fork({rpcport, rpchost});
		worker.on('message', (rc) => {
			let stage = fiapi.connectRPC().then(() => {
				return fiapi.client.call('fully_initialize', cfgObjs).then((rc) => { console.log("BladeIron: Initialized:"); console.log(rc); })		
			})

			ipcMain.on('awaken', (e, args) => {
				fiapi.client.call('unlock', [args]).then((rc) => { console.log(rc.result ? "unlocked" : "locked")})
			})

			ipcMain.on('tokenlist', (e, args) => {
				// args should already be a list
				fiapi.client.call('hotGroups', args).then((rc) => { console.log(rc.result ? args : "Warning: issues updating server-side token list!")})
			})

			ipcMain.on('gasprice', (e, args) => {
				fiapi.client.call('setGasPrice', [args]).then((rc) => { console.log(rc.result ? {'gasPrice': args} : "Warning: issues updating server-side gasPrice!")})
			})
		})

		process.on('exit', () => {
			console.log("Shutting down, please wait ...");
			fiapi.client.close();
			worker.kill('SIGINT');
		})
	} else {
		console.log(`No root config found! BladeWorker init skipped ...`)
	}

	return {fiapi, worker};
}

cluster.setupMaster({exec: path.join(__dirname, 'server.js')}); //BladeIron RPCServ

if (cluster.isMaster) {
	function createWindow () {
	    let rootcfg = loadConfig(path.join("public",".local","bootstrap_config.json"));

	    if (rootcfg.configDir !== '') {
		const {fiapi, worker} = bladeWorker(rootcfg);
	    }
	    // Create the browser window.
	    win = new BrowserWindow({minWidth: 1280, minHeight: 960, resizable: true, icon: path.join(__dirname, 'public', 'assets', 'icon', '11be_logo.png')});
	    win.setMenu(null);
	  
	    // and load the index.html of the app.
	    win.loadURL(url.format({
	      pathname: path.join(__dirname, '/public/index.html'),
	      protocol: 'file:',
	      slashes: true
	    }))
	  
	    //global.ipfs  = ipfs;
	    global.cfgobj = rootcfg;
	
	    // Open the DevTools.
	    win.webContents.openDevTools()
	  
	    // Emitted when the window is closed.
	    win.on('closed', () => {
	      // Dereference the window object, usually you would store windows
	      // in an array if your app supports multi windows, this is the time
	      // when you should delete the corresponding element.
	      win = null
	    })
	}
	
	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on('ready', createWindow)
	
	// Whole process reloader via ipcRenderer for config reload
	ipcMain.on('reload', (e, args) => {
	    	let rootcfg = loadConfig(path.join("public",".local","bootstrap_config.json"));
		const {fiapi, worker} = bladeWorker(rootcfg);
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
}


