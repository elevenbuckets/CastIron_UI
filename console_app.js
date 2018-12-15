'use strict';

const path = require('path')
const url = require('url')
const fs = require('fs')
const WSClient = require('rpc-websockets').Client;
const repl = require('repl');
const figlet = require('figlet');

// App or 11BE base
const __load_app = process.argv.length === 3 ? process.argv[2] : '11be';

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
        //let wsrpc   = new WSClient('ws://' + rpchost + ':' + rpcport);
	let output  = {cfgObjs};
	let BIApi;
	let appOpts
	
	console.log(`DEBUG: __load_app = ${__load_app}`);
	if (__load_app !== '11be') { // FIXME: better app folder structure needed.
		BIApi = require('./' + __load_app + '.js');
		appOpts = require('./' + __load_app + '.json');
		if (appOpts.appName == '11be') throw "Invalid App Name which uses preserved words";
	} else {
		BIApi = require('bladeiron_api');
		appOpts = {
			"appName": "__MAIN__",
	                "artifactDir": __dirname,
	                "conditionDir": __dirname,
	                "contracts": [],
	                "networkID": gethcfg.networkID,
	                "version": "1.0" 
		}
	}

	__load_app === '11be' 
		? output['be'] = new BIApi(rpcport, rpchost, appOpts)
		: output[appOpts.appName] = new BIApi(rpcport, rpchost, appOpts);

	return output;
}

// ASCII Art!!!
const ASCII_Art = (word) => {
        const _aa = (resolve, reject) => {
                figlet(word, {font: 'Big'}, (err, data) => {
                        if (err) return reject(err);
                        resolve(data);
                })
        }

        return new Promise(_aa);
}

// Handling promises in REPL (for node < 10.x)
const replEvalPromise = (cmd,ctx,filename,cb) => {
  let result=eval(cmd);
  if (result instanceof Promise) {
    return result.then(response=>cb(null,response));
  }
  return cb(null, result);
}

// Main
let rootcfg = loadConfig(path.join("public",".local","bootstrap_config.json"));
let app, r;

if (rootcfg.configDir !== '') {
	let slogan = "11BE Dev Console";
	app = bladeWorker(rootcfg);
		ASCII_Art(slogan).then((art) => {
          		console.log(art);
			r = repl.start({ prompt: `[-= ${slogan} =-]$ `, eval: replEvalPromise });
			r.context = {app};
		       	r.on('exit', () => {
		       		console.log("\n\t" + 'Stopping CLI...');
				app.be.client.close();
		       	});
       		});
} else {
	throw "Please setup bootstrap config first ..."; 
}
