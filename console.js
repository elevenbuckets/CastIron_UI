'use strict';

const path = require('path')
const url = require('url')
const fs = require('fs')
const WSClient = require('rpc-websockets').Client;
const repl = require('repl');
const figlet = require('figlet');

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
        let wsrpc   = new WSClient('ws://' + rpchost + ':' + rpcport);

	return {wsrpc, cfgObjs};
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
				app.wsrpc.close();
		       	});
       		});
} else {
	throw "Please setup bootstrap config first ..."; 
}
