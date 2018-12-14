'use strict';

const WSServ = require('rpc-websockets').Server;
const Web3   = require('web3');
const net    = require('net');
const os     = require('os');
const path   = require('path');
const fs     = require('fs');
const uuid  = require('uuid/v4');
const BigNumber = require('bignumber.js');
const fetch     = require('node-fetch');
const ipfsctl = require('ipfsd-ctl');
const ipfsAPI = require('ipfs-api');
const { execFileSync } = require('child_process');

// account manager
const bcup  = require('buttercup');
const { createCredentials, FileDatasource } = bcup;
const masterpw = new WeakMap();

// condition checks
const web3EthFulfill = require( __dirname + '/rpcserv/conditions/Web3/Fulfill.js' );
const web3EthSanity  = require( __dirname + '/rpcserv/conditions/Web3/Sanity.js' );
const TokenSanity    = require( __dirname + '/rpcserv/conditions/Token/Sanity.js' ); // auto mapping from contract ABI
const allConditions  = { ...web3EthSanity, ...web3EthFulfill, ...TokenSanity };

// EIP20 standard ABI
const EIP20ABI = require( __dirname + '/rpcserv/ABI/StandardToken.json' );

// token list (taken from https://balanceof.me)
const Tokens = require( __dirname + '/rpcserv/configs/Tokens.json' );

// Electron asar path fix
const __asar_unpacked = (inPath) => {
        const _fs = process.versions.electron
                ? require('original-fs')
                : fs

        let outPath = inPath.replace(/app.asar/, 'app.asar.unpacked');
        return _fs.existsSync(outPath) ? outPath : inPath;
}

// BladeIron
class BladeIron {
	constructor() 
	{
		masterpw.set(this, {passwd: null});

		this.web3 = new Web3();
		this.web3.toAddress = address => {
                        let addr = String(this.web3.toHex(this.web3.toBigNumber(address)));

                        if (addr.length === 42) {
                                return addr
                        } else if (addr.length > 42) {
                                throw "Not valid address";
                        }

                        let pz = 42 - addr.length;
                        addr = addr.replace('0x', '0x' + '0'.repeat(pz));

                        return addr;
                };

		this.ipc3 = new Web3();

		this.CUE = { 'Web3': { 'ETH': {'sendTransaction': this.web3.eth.sendTransaction } }, 'Token': {} };
                Object.keys(allConditions).map( (f) => { if(typeof(this[f]) === 'undefined') this[f] = allConditions[f] } );

		this.setup = (cfgobj) => {
			this.AToken = {};
			this.allocated = {};
			this.configs = cfgobj;
	                this.rpcAddr = this.configs.rpcAddr || null;
        	        this.ipcPath = this.configs.ipcPath || null;
			this.networkID = this.configs.networkID || 'NO_CONFIG';
	                this.condition = this.configs.condition || null; // 'sanity' or 'fulfill'
	                this.archfile  = this.configs.passVault || null;

			if (this.archfile !== null) {
	                        this.ds = new FileDatasource(this.archfile);
        	        } else {
                	        this.ds = {};
                	}

			this.GasOracle = this.configs.gasOracleAPI || undefined;
                	this.TokenList = Tokens[this.networkID];
			this.userWallet = undefined;
                	this.gasPrice = this.configs.defaultGasPrice || 50000000000;
			this.qTimeout  = this.configs.queueInterval || 5000;
		}

		this.password = (value) => { masterpw.get(this).passwd = value };

		this.validPass = () =>
	        {
	               let pw = masterpw.get(this).passwd;
	               return this.ds.load(createCredentials.fromPassword(pw)).then( (myArchive) =>
	                      {
	                         return true;
	                      })
	                      .catch( (err) =>
	                      {
				 //console.log(err);
	                         return false;
	                      });
	        }

		this.managedAddress = (address) =>
	        {
	               let pw = masterpw.get(this).passwd;
	               return this.ds.load(createCredentials.fromPassword(pw)).then( (myArchive) =>
	                      {
	                        let vaults = myArchive.findGroupsByTitle("ElevenBuckets")[0];
	                        let passes = undefined;
	
	                        try {
	                                passes = vaults.findEntriesByProperty('username', address)[0].getProperty('password');
	                        } catch(err) {
	                                console.log(err);
	                                passes = undefined;
	                        }
	
	                        return typeof(passes) === 'undefined' ? {[address]: false} : {[address]: true};
	                      })
	        }

		this.connectRPC = () => 
		{
	                const __connectRPC = (resolve, reject) => {
	                        try {
	                                if (
	                                    this.web3 instanceof Web3
	                                 && this.web3.net._requestManager.provider instanceof Web3.providers.HttpProvider
	                                ) {
	
	                                        if (this.networkID === 'NO_CONNECTION') this.networkID = this.configs.networkID; // reconnected
	                                        if (this.web3.version.network != this.networkID) {
	                                                throw(`Connected to network with wrong ID: wants: ${this.networkID}; geth: ${this.web3.net.version}`);
	                                        }
	
	                                        resolve(true);
	                                } else if (this.web3 instanceof Web3) {
	                                        this.web3.setProvider(new Web3.providers.HttpProvider(this.rpcAddr));
	
	                                        if (this.networkID === 'NO_CONNECTION') this.networkID = this.configs.networkID; // reconnected
	                                        if (this.web3.version.network != this.networkID) {
	                                                throw(`Connected to network with wrong ID: wants: ${this.networkID}; geth: ${this.web3.net.version}`);
	                                        }
	
	                                        resolve(true);
	                                } else {
	                                        reject(false);
	                                }
	                        } catch (err) {
	                                console.log(err);
	                                reject(false);
	                        }
	                }
	
	                return new Promise(__connectRPC);
	        }
	
		this.connectIPC = () => 
		{
	                const __connectIPC = (resolve, reject) => {
	                        try {
	                                if (
	                                    this.ipc3 instanceof Web3
	                                 && this.ipc3.net._requestManager.provider instanceof Web3.providers.IpcProvider
	                                ) {
	                                        resolve(true);
	                                } else if (this.ipc3 instanceof Web3) {
	                                        this.ipc3.setProvider(new Web3.providers.IpcProvider(this.ipcPath, net));
	                                        resolve(true);
	                                } else {
	                                        reject(false);
	                                }
	                        } catch (err) {
	                                console.log(err);
	                                reject(false);
	                        }
	                }
	
	                return new Promise(__connectIPC);
	        }	
	
		this.connect = () => {
	                let stage = Promise.resolve();
	
	                stage = stage.then(() => {
	                        return this.connectRPC();
	                })
	                .then((rc) => {
	                        if (rc) {
					this.TokenABI  = this.web3.eth.contract(EIP20ABI);
	                                return this.connectIPC();
	                        } else {
	                                throw("no connection");
	                        }
	                })
	                .catch((err) => {
	                        this.networkID = 'NO_CONNECTION';
	                        return Promise.resolve(false);
	                });
	
	                return stage;
	        }
	
		this.allAccounts = () => { return this.web3.eth.accounts; }

		this.ethNetStatus = () =>
	        {
	                if (this.web3.net.peerCount === 0 && this.web3.eth.mining === false) {
	                        return {blockHeight: 0, blockTime: 0, highestBlock: 0};
	                }
	
	                let sync = this.web3.eth.syncing;
	
	                if (sync === false) {
	                        let blockHeight = this.web3.eth.blockNumber;
	                        let blockTime;
	
	                        try {
	                                blockTime = this.web3.eth.getBlock(blockHeight).timestamp;
	                        } catch(err) {
	                                blockTime = 0;
	                                blockHeight = 0;
	                        }
	
	                        return {blockHeight, blockTime, highestBlock: blockHeight};
	                } else {
	                        let blockHeight = sync.currentBlock;
	                        let highestBlock = sync.highestBlock;
	                        let blockTime;
	                        try {
	                                blockTime = this.web3.eth.getBlock(blockHeight).timestamp;
	                        } catch(err) {
	                                blockTime = 0;
	                                blockHeight = 0;
	                                highestBlock = 0;
	                        }
	
	                        return {blockHeight, blockTime, highestBlock};
	                }
	        }

		this.addrEtherBalance = addr => { return this.web3.eth.getBalance(addr); }
		this.byte32ToAddress = (b) => { return this.web3.toAddress(this.web3.toHex(this.web3.toBigNumber(String(b)))); };
	        this.byte32ToDecimal = (b) => { return this.web3.toDecimal(this.web3.toBigNumber(String(b))); };
        	this.byte32ToBigNumber = (b) => { return this.web3.toBigNumber(String(b)); };

		// These three actually need to be at the client side as well...
		this.toEth = (wei, decimals) => new BigNumber(String(wei)).div(new BigNumber(10 ** decimals));
	        this.toWei = (eth, decimals) => new BigNumber(String(eth)).times(new BigNumber(10 ** decimals)).floor();
        	this.hex2num = (hex) => new BigNumber(String(hex)).toString();

		this.unlockViaIPC = passwd => addr =>
	        {
	                const __unlockToExec = (resolve, reject) => {
	                        this.ipc3.personal.unlockAccount(addr, passwd, 120, (error, result) => {
	                                if (error) {
	                                        reject(error);
	                                } else if (result != true) {
	                                        setTimeout( () => __unlockToExec(resolve, reject), 500 );
	                                } else {
	                                        resolve(true);
	                                }
	                        });
	                };
	
	                return new Promise(__unlockToExec);
	        }

		this.configured = () => 
		{
                	if (this.networkID === 'NO_CONFIG') {
                        	return false;
                	} else {
                        	return true;
                	}
        	}

		this.closeIPC = () =>
	        {
	                const __closeIPC = (resolve, reject) => {
	                        try {
	                                if (
	                                    this.ipc3 instanceof Web3
	                                 && this.ipc3.net._requestManager.provider instanceof Web3.providers.IpcProvider
	                                ) {
	                                        console.log("Shutdown ipc connection!!!");
	                                        resolve(this.ipc3.net._requestManager.provider.connection.destroy());
	                                } else if (this.ipc3 instanceof Web3) {
	                                        console.log("Still pending to shutdown ipc connection!!!");
	                                        setTimeout( () => __closeIPC(resolve, reject), 500 );
	                                }
	                        } catch (err) {
	                                console.log("Uh Oh...... (closeIPC)" + err);
	                                reject(false);
	                        }
	                };
	
	                return new Promise(__closeIPC);
	        }

		this.connected = () => 
		{
	                if (!this.configured()) return false;
	
	                let live;
	                try {
	                        live = this.web3 instanceof Web3 && this.web3.net._requestManager.provider instanceof Web3.providers.HttpProvider && this.web3.net.listening;
	                } catch(err) {
	                        live = false;
	                }
	
	                return live;
	        }

		this.getReceipt = (txHash, interval) =>
	        {
	                if (txHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
	                        return Promise.resolve({transactionHash: txHash});
	                }
	
	                const transactionReceiptAsync = (resolve, reject) => {
	                        this.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
	                                if (error) {
	                                        reject(error);
	                                } else if (receipt == null) {
	                                        setTimeout( () => transactionReceiptAsync(resolve, reject), interval ? interval : 500);
	                                } else {
	                                        resolve(receipt);
	                                }
	                        });
	                };
	
	                if (Array.isArray(txHash)) {
	                        return Promise.all( txHash.map(oneTxHash => this.getReceipt(oneTxHash, interval)) );
	                } else if (typeof txHash === "string") {
	                        return new Promise(transactionReceiptAsync);
	                } else {
	                        throw new Error("Invalid Type: " + txHash);
	                }
	        }

		this.gasCostEst = (addr, txObj) =>
	        {
	                if (
	                        txObj.hasOwnProperty('gas') == false
	                     || txObj.hasOwnProperty('gasPrice') == false
	                ) { throw new Error("txObj does not contain gas-related information"); }
	
	                let gasBN = this.web3.toBigNumber(txObj.gas);
	                let gasPriceBN = this.web3.toBigNumber(txObj.gasPrice);
	                let gasCost = gasBN.mul(gasPriceBN);
	
	                return gasCost;
	        }

		this.version = '1.0'; // API version
                this.jobQ = {}; // Should use setter / getter
                this.rcdQ = {}; // Should use setter / getter
		
	  	this.enqueue = jobObj => addr => 
		{
	                let {Q, ...job} = jobObj;
	
	                if (Q == undefined || typeof(this.jobQ[Q]) === 'undefined' || this.condition === null) {
	                        throw new Error("Queue error (enqueue)");
	                } else if (typeof(this.jobQ[Q][addr]) === 'undefined') {
	                        this.jobQ[Q][addr] = [];
	                }
	
	                //conditional function call
	                let cfname = `${jobObj.type}_${jobObj.call}_${this.condition}`;
	
	                if (typeof(this[cfname]) === 'undefined') {
	                        throw new Error(`Invalid jobObj: ${JSON.stringify(jobObj, 0, 2)}`);
	                } else if (typeof(this.CUE[jobObj.type]) === 'undefined' || typeof(this.CUE[jobObj.type][jobObj.contract]) === 'undefined') {
	                        throw new Error(`Invalid or unknown contract ABI: ${JSON.stringify(jobObj, 0, 2)}`);
	                } else if (this[cfname](addr, jobObj) == true) {
	                        let args = job.args.map((e) =>
	                        {
	                                if (typeof(job[e]) === 'undefined') {
	                                        throw new Error(`jobObj missing element ${e} for ${cfname} action`);
	                                }
	
	                                return job[e];
	                        });
	
	                        this.jobQ[Q][addr].push({...job, args}); // replace 
	
	                        return true;
	                } else {
	                        return false;
	                }
	        }

		this.prepareQ = timeout =>
	        {
	                const __initQueue = (resolve, reject) => {
	                        if (Object.keys(this.jobQ).length !== 0) {
	                                setTimeout(() => __initQueue(resolve, reject), timeout);
	                        } else {
	                                let myid = uuid();
	                                this.jobQ[myid] = {};
	                                this.rcdQ[myid] = [];
	
	                                resolve(myid);
	                        }
	                };
	
	                return new Promise(__initQueue);
	        }

		this.processQ = Q => 
		{
			let pw = masterpw.get(this).passwd;
	
			if (Q == undefined) {
				throw "processQ: Invalid QID!!!";
			} else if (typeof(this.jobQ[Q]) === 'undefined' || this.jobQ[Q].length === 0|| pw === null) {
				delete this.jobQ[Q];
				throw "Queue error (processQ), skipping...";
			}
	
			return this.ds.load(createCredentials.fromPassword(pw)).then( (myArchive) => {
				let vaults = myArchive.findGroupsByTitle("ElevenBuckets")[0];
			        let results = Promise.resolve(); 
	
		        	Object.keys(this.jobQ[Q]).map((addr) => {
					let passes;
	
					try {
						passes = vaults.findEntriesByProperty('username', addr)[0].getProperty('password');
					} catch(err) {
						passes = undefined;
					}
		
		                	if (typeof(passes) === 'undefined' || passes.length == 0) {
						delete this.jobQ[Q][addr];
						console.warn("no password provided for address " + addr + ", skipped ...");
		
		                        	return;
		                	}
		
			                results = results.then( () => {
		        	                return this.unlockViaIPC(passes)(addr).then(() => {
		                	                this.jobQ[Q][addr].map((o, id) => 
							{
								try {
			                        	        	let tx = this.CUE[o.type][o.contract][o.call](...o.args, o.txObj);
									console.debug(`QID: ${Q} | ${o.type}: ${addr} doing ${o.call} on ${o.contract}, txhash: ${tx}`);
		
								  	if (typeof(o['amount']) !== 'undefined') {
								    		this.rcdQ[Q].push({id, addr, tx, 
											'type': o.type, 
											'contract': o.contract, 
											'call': o.call, ...o.txObj, 
											'amount': o.amount
										});
								  	} else {
								    		this.rcdQ[Q].push({id, addr, tx, 
											'type': o.type, 
											'contract': o.contract, 
											'call': o.call, ...o.txObj,
										        'amount': null
										});
								  	}
								} catch(error) {
									this.rcdQ[Q].push({id, addr, error,
										'tx': null,
									        'type': o.type, 
									        'contract': o.contract, 
									        'call': o.call, ...o.txObj, 
									        'amount': typeof(o['amount']) !== 'undefined' ? o.amount : null
									});
									throw(error);
								}
		                                	})
			                        }).then( () => {
		        	                        this.ipc3.personal.lockAccount(addr, (error, r) => {
		                        	                if (error) {
									this.rcdQ[Q].push({
									  	'id': null, addr, 
									  	'tx': null, error, 
									  	'type': 'ipc3', 
									  	'contract': 'personal', 
									  	'call': 'lockAccount',
									  	'amount': null
								  	});
									throw(error);
								}
		
		                	                        console.debug(`** account: ${addr} is now locked`);
								delete this.jobQ[Q][addr];
			                                });
		        	                })
		
		                	}).catch( (error) => { console.error(error); delete this.jobQ[Q][addr]; return Promise.resolve(); } );
		        	}); 
			
				results = results.then(() => { return this.closeQ(Q) });
	
				return results;
	
			}).catch( (error) => { console.log(error); delete this.jobQ[Q]; return this.closeQ(Q); });
		}

		this.closeQ = Q => 
		{
			if (Q == undefined || typeof(this.jobQ[Q]) === 'undefined') throw "Queue error (closeQ)";
	
			const __closeQ = (resolve, reject) => {
				if (Object.keys(this.jobQ[Q]).length == 0) {
					delete this.jobQ[Q];
					resolve(Q);
				} else if (Object.keys(this.jobQ[Q]).length > 0 && this.ipc3 && this.ipc3.hasOwnProperty('net') == true){
					setTimeout( () => __closeQ(resolve, reject), 500 );
				} else {
					console.error("Uh Oh...... (closeQ)");
					reject(false);
				}
			};
	
			return new Promise(__closeQ);
		}

		this.gasPriceEst = () =>
	        {
	                let results = Promise.resolve();
	
	                results = results.then(() =>
	                {
	                        return fetch(this.GasOracle)
	                                .then( (r) => { return r.json(); })
	                                .then( (json) => {
	                                                   return {   // ethGasStation returns unit is 10GWei, hence 10 ** 8
	                                                                low: String(Number(json.safeLow)*(10 ** 8)),
	                                                                mid: String(Number(json.average)*(10 ** 8)),
	                                                               high: String(Number(json.fast)*(10 ** 8)),
	                                                               fast: String(Number(json.fastest)*(10 ** 8)),
	                                                            onblock: json.blockNum
	                                                          };
	                                                 })
	                                .catch( (e) => { throw(e); })
	                })
	
	                return results;
	        }

		this.hotGroups = tokenList =>
	        {
	                if (this.connected()) {
	                        this.TokenABI  = this.web3.eth.contract(EIP20ABI);
	                }
	
	                let rc = tokenList.map( (token) =>
	                {
	                        if (typeof(this.TokenList[token]) === 'undefined') return false;
	
	                        let record = this.TokenList[token];
	
	                        this.CUE.Token[token] = this.TokenABI.at(record.addr);
	                        this.AToken[token] = this.web3.toBigNumber(10).pow(record.decimals);
	
	                        return true;
	                });
	
	                return rc.reduce((result, stat) => { return result && (stat === true) });
	        }

		this.setAccount = addr =>
	        {
	                this.userWallet = addr;
	                if (typeof(this.allocated[addr]) === 'undefined') this.allocated[addr] = new BigNumber(0);
	
	                return true;
	        }

		this.processJobs = jobObjList => 
		{
			let tokenList = jobObjList
				.map( (job) => { return job.contract; } )
				.filter( (value, index, self) => 
				{ 
					return self.indexOf(value) === index; 
				});
	
			let txOnly = this.hotGroups(tokenList);
			
			return this.prepareQ(this.qTimeout)
				.then( (Q) => 
				{
					console.debug(`Queue ID: ${Q}, Enqueuing ...`);
	
					jobObjList.map( (job) => 
					{
						this.setAccount(job.txObj.from);
						let userBalance = this.web3.eth.getBalance(this.userWallet); 
	
						console.debug(` - Account: ${this.userWallet}; Balance: ${userBalance} ETH`);
	
						let gasCost = new BigNumber(job.txObj.gas).times(this.gasPrice); 
	
						if (
						        typeof(this.TokenList[job.contract]) === 'undefined'
						     && typeof(job.type) !== 'undefined' 
						     && job.type === 'Token'
						     && userBalance.sub(this.allocated[this.userWallet]).gte(gasCost)
						) {
							console.debug(`WARN: Unknown token ${job.contract}, skipping job ...`);
							return;
						} else if (
					     	        typeof(this.CUE[job.type]) === 'undefined'
					     	     || typeof(this.CUE[job.type][job.contract]) === 'undefined'
						) {
							console.warn(`WARN: Invalid call ${job.type}.${job.contract}.${job.call}, skipping job ...`);
							return;
						} else if (
							job.type !== 'Web3' 
						     && userBalance.sub(this.allocated[this.userWallet]).gte(gasCost) 
						) {
							console.debug(`INFO: calling ${job.type}.${job.contract}.${job.call}, allocating gas fee from wallet: ${gasCost}`);
							this.allocated[this.userWallet] = this.allocated[this.userWallet].add(gasCost);
						} else if (
							job.type === 'Web3' 
						     && userBalance.sub(this.allocated[this.userWallet]).sub(job.txObj.value).gte(gasCost) 
						) {
							console.debug(`INFO: sending Ether, allocating gas fee ${gasCost} and ether ${job.txObj.value} from wallet`);
							this.allocated[this.userWallet] = this.allocated[this.userWallet].add(gasCost).add(job.txObj.value);
						} else {
							console.warn(`WARN: Insufficient fund in wallet, skipping job ...`);
							return;
						}
	
						this.enqueue({...job, Q})(this.userWallet);
					})

					this.allocated = {};	
					return Q;
				})
				.then( (Q) => { return this.processQ(Q); })
				.catch( (err) => { console.error(err); throw "ProcessJob failed, skipping QID..."; } );
		}

		this.enqueueTx = tokenSymbol => (fromWallet, toAddress, amount, gasAmount) => 
		{
			// txObj field checks.
			// While CastIron has conditions to perform final checks before send, basic checks here will allow 
			// caller to drop invalid txObj even before entering promise chain.
			if (
				this.web3.toAddress(fromWallet) !== fromWallet
			     || this.web3.toAddress(toAddress) !== toAddress
			     || Number(amount) <= 0
			     || isNaN(Number(amount))
			     || Number(gasAmount) <= 0
			     || isNaN(Number(gasAmount))
			){
				throw "enqueueTx: Invalid element in txObj";
			};
	
			if (tokenSymbol === 'ETH') {
				return {
					Q: undefined,
					type: 'Web3',
					contract: 'ETH',
					call: 'sendTransaction',
					args: [],
					txObj: { from: fromWallet, to: toAddress, value: amount, gas: gasAmount, gasPrice: this.gasPrice } 
				}
			} else {
				return {
					Q: undefined,
					type: 'Token',
					contract: tokenSymbol,
					call: 'transfer',	
					args: ['toAddress', 'amount'],
					toAddress,
					amount,
					txObj: { from: fromWallet, gas: gasAmount, gasPrice: this.gasPrice }
				}
			}
		}

		this.addrTokenBalance = tokenSymbol => walletAddr =>
	        {
	                if (typeof(this.CUE.Token[tokenSymbol]) === 'undefined') throw new Error(`Token ${tokenSymbol} is not part of current hot group`);
	                return this.CUE.Token[tokenSymbol].balanceOf(walletAddr);
	        }

		this.enqueueTk = (type, contract, call, args) => (fromWallet, amount, gasAmount, tkObj) =>
	        {
	                let txObj = {};
	
	                // txObj field checks.
	                // While CastIron has conditions to perform final checks before send, basic checks here will allow 
	                // caller to drop invalid txObj even before entering promise chain.
	                //
	                // Note: for enqueueTk, it is the caller's duty to verify elements in tkObj.
	                if (
	                        this.web3.toAddress(fromWallet) !== fromWallet
	                     || Number(gasAmount) <= 0
	                     || isNaN(Number(gasAmount))
	                ){
	                        throw "enqueueTk: Invalid element in txObj";
	                };
	
	                if (amount === null) {
	                        txObj = { from: fromWallet, gas: gasAmount, gasPrice: this.gasPrice }
	                } else if (amount > 0) {
	                        txObj = { from: fromWallet, value: amount, gas: gasAmount, gasPrice: this.gasPrice }
	                }
	
	                return { Q: undefined, type, contract, call, args, ...tkObj, txObj };
	        }

		this.verifyApp = appSymbol => (version, contract, abiPath, conditions) =>
	        {
	                if (appSymbol === 'Web3' || appSymbol === 'Token') return false; // preserved words
	
	                // placeholder to call on-chain package meta for verification
	                // This should generate all checksums and verify against the records on pkg manager smart contract
	                // Smart contract ABI binding to pkg manager should happen during constructor call!
	                return true;
	        }

		this.newApp = appSymbol => (version, contract, abiPath, conditions, address = null) =>
	        {
	                if (this.verifyApp(appSymbol)(version, contract, abiPath, conditions) === false) throw 'Invalid dApp info';
	
	                let buffer = fs.readFileSync(abiPath);
	                let artifact = JSON.parse(buffer.toString());
	                artifact.contract_name = contract;
	
	                if (typeof(this.CUE[appSymbol]) === 'undefined') this.CUE[appSymbol] = { ABI: {} };
	
	                if (address === '0x') {
	                        this.CUE[appSymbol][contract] = undefined;
	                        return { [appSymbol]: version, 'Ready': false };
	                }
	
	                // appSymbol contains the string which becomes the 'type' keywords of the app
	                // contract is the name of the contract
	                let abi  = this.web3.eth.contract(artifact.abi);
	                let addr;
	
	                if (address !== null) {
	                        console.debug(`custom address for contract ${contract} found...`);
	                        addr = address;
	                } else {
	                        console.debug(`contract address fixed ...`);
	                        addr = artifact.networks[this.networkID].address;
	                }
	
	                this.CUE[appSymbol][contract] = abi.at(addr);
			this.CUE[appSymbol].ABI[contract] = artifact.abi;

			// console.log(this.CUE[appSymbol].ABI[contract]); console.log('---'); console.log(conditions);	// DEBUG
	                // conditions is objects of {'condition_name1': condPath1, 'condition_name2': condPath2 ...}
	                let allConditions = {};
	
	                Object.keys(conditions).map((cond) =>
	                {
	                        let thiscond = require(conditions[cond]);
	                        allConditions = { ...allConditions, ...thiscond };
	                });
	
	                // loading conditions. there names needs to follow CastIron conventions to be recognized by queue, otherwise job will fail.
	                Object.keys(allConditions).map((f) => { if(typeof(this[f]) === 'undefined') this[f] = allConditions[f] });

			return { [appSymbol]: version, 'Ready': true };
	        }
	}
}

//IPFS_Blade
class IPFS_Blade {
	constructor() {
		// local IPNS cache
		this.localCache = {};
		this.resolveTimer;
		this.ready = false

		this.init = (cfgobj) => {
			try {
                        	this.cfsrc = cfgobj;
                        	this.options = {args: ['--enable-pubsub-experiment'], disposable: false, init: true, repoPath: this.cfsrc.repoPathGo};

                        	if (typeof(this.cfsrc.ipfsBinary) === 'undefined') {
                                	let goipfspath = path.dirname(path.dirname(require.resolve('go-ipfs-dep')));
                                	this.cfsrc.ipfsBinary = __asar_unpacked(path.join(goipfspath, 'go-ipfs', 'ipfs'));
                        	}
                	} catch (err) {
                        	let goipfspath = path.dirname(path.dirname(require.resolve('go-ipfs-dep')));
                        	this.cfsrc = {
                                	repoPathGo: '/tmp/ipfs_tmp',
                                	lockerpathgo: '/tmp/.locker_go',
                                	ipfsBinary: __asar_unpacked(path.join(goipfspath, 'go-ipfs', 'ipfs'))
                        	};
                        	this.options = {args: ['--enable-pubsub-experiment'], disposable: true, init: true, repoPath: this.cfsrc.repoPathGo};
                	}

                	if (this.options.disposable === false && fs.existsSync(this.cfsrc.lockerpathgo)) this.options.init = false;
                	if (this.options.disposable === false && this.options.init) {
                        	console.log(`Initializing IPFS repo at ${this.cfsrc.repoPathGo} ...`);
                        	execFileSync(this.cfsrc.ipfsBinary, ['init'], {env: {IPFS_PATH: this.cfsrc.repoPathGo}});
                	}
		}

		this.start = () => 
		{
	                this.ipfsd = ipfsctl.create({type: 'go', exec: this.cfsrc.ipfsBinary});
	
	                const __spawn = (resolve, reject) => {
	                        this.ipfsd.spawn(this.options, (err, ipfsFactory) => {
	                                if (err) return reject(err);
	
	                                if (!this.options.disposable) fs.writeFileSync(this.cfsrc.lockerpathgo, JSON.stringify(this.cfsrc,0,2));
	
	                                ipfsFactory.start(this.options.args, (err) => {
	                                        if (err) return reject(err);

	                                        this.controller = ipfsFactory;
	                                        let apiAddr = ipfsFactory.api.apiHost;
	                                        let apiPort = ipfsFactory.api.apiPort;
	                                        this.ipfsAPI = ipfsAPI(apiAddr, apiPort, {protocol: 'http'})
	
	                                        console.log("repoPath: " + ipfsFactory.repoPath)
	
						this.ready = true;
	                                        resolve(this.ipfsAPI);
	                                })
	                        });
	                }
	
	                return new Promise(__spawn);
	        }

		this.stop = (graceTime = 31500) => 
		{
	                const __stop = (resolve, reject) => {
	                        this.controller.stop(graceTime, (err) => {
	                                if (err) return reject(false);
					this.ready = false;
	                                resolve(true);
	                        })
	                }
	
	                return new Promise(__stop);
	        }

		// Class methods in constructor to skip babel class transform
		this.pullFile = (ipfshash, outpath) => {
			return this.read(ipfshash).then((r) => {
				fs.writeFileSync(outpath, r);
				return true;
			})
		}

		this.ping = (nodehash) => { return this.ipfsAPI.ping(nodehash, {count: 3}).then((r) => { return {cmd: r[0].text, count: 3, results: r[4]}}) }
		this.getConfigs = () => { return this.ipfsAPI.config.get().then((b) => { return JSON.parse(b.toString())}); }
		this.setConfigs = (entry, value) => { 
			return this.ipfsAPI.config.set(entry, value).then( () => { 
				return this.ipfsAPI.config.get(entry).then((r) => { return { [entry]: r } });
			}); 
		}

		this.put = (fpath) => 
		{
                	let buff = fs.readFileSync(fpath);
                	return this.ipfsAPI.files.add(buff); // return a promise
        	}

        	this.lspin = () => { return this.ipfsAPI.pin.ls(); }
        	this.read = (hash) => { return this.ipfsAPI.files.cat('/ipfs/' + hash); }
        	this.readPath = (ipfsPath) => { return this.ipfsAPI.files.cat(ipfsPath); }

        	this.publish = (contentHash, key=null) => {
                	let options = {};

                	if (key !== null) options['key'] = key;
                	return this.ipfsAPI.name.publish(contentHash, options);
        	}

		this.resolve = (ipnsHash) => {
		        const __resolve_background = () => {
				return setTimeout(() => {
					let result = this.ipfsAPI.name.resolve(ipnsHash);
					this.localCache[ipnsHash] = {seen: Date.now(), result};
				});
			}

			if (ipnsHash in this.localCache) {
				console.log(`DEBUG: using cache`);
				if (Date.now() - this.localCache[ipnsHash].seen >= 30000) {
					console.log(`DEBUG: cache will be refreshed`);
					this.resolveTimer = __resolve_background();
				}
				return this.localCache[ipnsHash].result;
			} else {
				console.log(`DEBUG: initalizing new query ...`);
				let result = this.ipfsAPI.name.resolve(ipnsHash);
				this.localCache[ipnsHash] = {seen: Date.now(), result};
				return result;
			}
		}

		this.bootnodes = () => { return this.ipfsAPI.bootstrap.list(); }
		this.pullIPNS = (ipnsHash) => {
			return this.resolve(ipnsHash)
				.then((ipfshash) => { return this.readPath(ipfshash) })
				.then((r) => { return JSON.parse(r.toString()); });
		}
		this.myid = () => { return this.ipfsAPI.id() }
	}
}

const biapi = new BladeIron();
const ipfsi = new IPFS_Blade();
const rpcport = process.env.rpcport;
const rpchost = process.env.rpchost;

// Create a server 
const server = new WSServ({
  port: rpcport,
  host: rpchost
});

server.on('listening', () => { process.send("Ready") });
// Registering methods
server.event('connected');

server.register('initialize', (obj) => 
{
	biapi.setup(obj); 
	console.dir(obj);
	biapi.connect().then((rc) => 
	{
	         server.emit('connected', biapi.connected());
        });
});

server.register('accounts', () => { return biapi.allAccounts() });
server.register('ethNetStatus', () => { return biapi.ethNetStatus() });
server.register('unlock', (args) => 
{ 
	let ps = args[0];
	biapi.password(ps);
	return biapi.validPass();
});
server.register('hasPass', () => { return biapi.validPass() });
server.register('sendTx', (args) => // sendTx(tokenSymbol, fromWallet, toAddress, amount, gasAmount) 
{
	let jobObj = {};
	let tokenSymbol = args[0];
	let fromWallet  = args[1];
	let toAddress   = args[2];
	let amount      = args[3];
	let gasAmount = 5;

                if (tokenSymbol === 'ETH') {
                        gasAmount = 21000;
                } else {
		let callArgs = [toAddress, amount]
                        gasAmount = biapi.CUE['Token'][tokenSymbol]['transfer'].estimateGas(...callArgs, {from: fromWallet, gasPrice: biapi.gasPrice})
                }

	console.log(`DEBUG: sendTx sending ${tokenSymbol} using gasAmount = ${gasAmount}`)


	try {
		jobObj = biapi.enqueueTx(tokenSymbol)(fromWallet, toAddress, amount, gasAmount);
		return biapi.processJobs([jobObj]); // single job, thus single element in list
	} catch (err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('getTxObj', (args) => // getTxObj(tokenSymbol, fromWallet, toAddress, amount, gasAmount) 
{
	let tokenSymbol = args[0];
	let fromWallet  = args[1];
	let toAddress   = args[2];
	let amount      = args[3];
	let gasAmount = 5;

                if (tokenSymbol === 'ETH') {
                        gasAmount = 21000;
                } else {
		let callArgs = [toAddress, amount]
                        gasAmount = biapi.CUE['Token'][tokenSymbol]['transfer'].estimateGas(...callArgs, {from: fromWallet, gasPrice: biapi.gasPrice})
                }

	console.log(`DEBUG: sending ${tokenSymbol} using gasAmount = ${gasAmount}`)

	try {
		return Promise.resolve(biapi.enqueueTx(tokenSymbol)(fromWallet, toAddress, amount, gasAmount));
	} catch (err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('newApp', (args) => // newApp(appSymbol, version, contract, abiPath, conditions, address = null)
{
	let appSymbol = args[0];
	let version   = args[1];
	let contract  = args[2];
	let abiPath   = args[3];
	let conditions = args[4];

	try {
		if (args.length === 6 && args[5] != null) {
			let address = args[5];
			return Promise.resolve(biapi.newApp(appSymbol)(version, contract, abiPath, conditions, address));
		} else {
			return Promise.resolve(biapi.newApp(appSymbol)(version, contract, abiPath, conditions));
		}
	} catch (err) {
		console.log(err);
		return Promise.reject(server.error(404, err));
	}	
});

server.register('call', (callObj) => // callObj example: {appName: 'appName', ctrName: 'ctrName', callName: 'callName', args: [arg01, arg02 ...]}
{
	let abiObj = null;
	let appName = callObj.appName;
	let ctrName = callObj.ctrName;
	let callName = callObj.callName;
	try {
		abiObj = biapi.CUE[appName].ABI[ctrName].filter((i) => { return (i.name === callName && i.constant === true) } );
		
		if (abiObj.length === 1 && abiObj[0].inputs.length === callObj.args.length) {
			console.log("Calling " + callName)
			let __call = (resolve, reject) => {
				biapi.CUE[appName][ctrName][callName](...callObj.args, (err, result) => {
					if (err) return reject(err);
					console.log("HERE!")
					resolve(result);
				})
			}
			
			return new Promise(__call);
		} else {
			throw "Wrong function or function arguments";
		}
	} catch(err) {
		console.log(err);
		return Promise.reject(server.error(501, 'unsupported constant call'));
	}
});

server.register('getTkObj', (args) => // getTkObj(type, contract, call, appArgs, fromWallet, amount, tkObj)
{
	let type = args[0];
	let contract = args[1];
	let call = args[2];
	let appArgs = args[3];
	let fromWallet = args[4];
	let amount = args[5];
	let tkObj = args[6];
	let callArgs = appArgs.map((i) => { return tkObj[i] });
	let gasAmount = 5;

	if (amount != null) {
		gasAmount = biapi.CUE[type][contract][call].estimateGas(...callArgs, {from: fromWallet, gasPrice: biapi.gasPrice})
	} else {
		gasAmount = biapi.CUE[type][contract][call].estimateGas(...callArgs, {from: fromWallet, value: amount, gasPrice: biapi.gasPrice})
	}

	console.log(`DEBUG: calling ${call} using gasAmount = ${gasAmount}`)

	try {
		return Promise.resolve(biapi.enqueueTk(type, contract, call, appArgs)(fromWallet, amount, gasAmount, tkObj));
	} catch (err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('hotGroups', (tokenList) =>
{
	try {
		return Promise.resolve(biapi.hotGroups(tokenList));
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('setGasPrice', (args) => 
{
	let gasPrice = args[0];
	try {
		biapi.gasPrice = gasPrice;
		return Promise.resolve(true);
	} catch (err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('canUseAccount', (args) =>
{
	let address = args[0];
                if (biapi.allAccounts().indexOf(address) === -1) return Promise.reject(server.error(503, 'Account not found'));

                try {
                        return biapi.managedAddress(address);
                } catch(err) {
		console.log(err);
                        return Promise.reject(server.error(404, err));
                }	
});

server.register('processJobs', (jobList) =>
{
	try {
		return biapi.processJobs(jobList);
	} catch (err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('addrEtherBalance', (args) => // addrEtherBalance(address)
{
	let address = args[0];
	try {
		return Promise.resolve(biapi.addrEtherBalance(address));
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('addrTokenBalance', (args) => // addrTokenBalance(tokenSymbol, address)
{
	let tokenSymbol = args[0];
	let address     = args[1];

	try {
		return Promise.resolve(biapi.addrTokenBalance(tokenSymbol)(address));
	} catch (err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('getReceipts', (args) => // getRecepts(Q)
{
	let Q = args[0];
	let txhashes = biapi.rcdQ[Q].map((r) => { return r.tx });
	try {
		return biapi.getReceipt(txhashes);
	} catch (err) {
		console.log(err);
		return Promise.reject(server.error(404, err));
	}
});

server.event('ipfs_connected');
server.register('ipfs_initialize', (obj) =>
{
	ipfsi.init(obj);
	ipfsi.start().then(() => 
	{ 
		server.emit(ipfs_connected, typeof(ipfsi.ipfsd) !== 'undefined' && ipfsi.ready); 
	});		
});

server.register('ipfs_pullFile', (args) => // ipfs_pullFile(inhash, outpath)
{
	let inhash = args[0];
	let outpath = args[1];
	try {
		return ipfsi.pullFile(inhash, outpath);
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('ipfs_put', (args) => // ipfs_put(fpath)
{
	let fpath = args[0];
	try {
		return ipfsi.put(fpath);
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('ipfs_read', (args) => // ipfs_read(hash)
{
	let hash = args[0];
	try {
		return ipfsi.read(hash);
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('ipfs_readPath', (args) => // ipfs_readPath(ipfspath)
{
	let ipfspath = args[0];
	try {
		return ipfsi.readPath(ipfspath);
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('ipfs_publish', (args) => // ipfs_resolve(contentHash, key = null)
{
	let hash = args[0];
	try {
		if (args.length === 2 && args[1] != null) {
			let key = args[1];
			return ipfsi.publish(hash, key);
		} else if (args.length === 1) {
			return ipfsi.publish(hash);
		}
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('ipfs_resolve', (args) => // ipfs_resolve(ipnsHash)
{
	let ipnsHash = args[0];
	try {
		return ipfsi.resolve(ipnsHash);
	} catch(err) {
		return Promise.reject(server.error(404, err));
	}
});

server.register('ipfs_myid', () => { return ipfsi.myid() });

server.register('ipfs_pullIPNS', (args) => // ipfs_pullIPNS(ipnsHash)
{
	let ipnsHash = args[0];
	try {
		return ipfsi.pullIPNS(ipnsHash);
	} catch(err) {
		return Promise.reject(server.error(404, err));
	} 
});

server.register('ipfs_lspin', () =>
{
	try {
		return ipfsi.lspin();
	} catch(err) {
		return Promise.reject(server.error(404, err));
	} 
});

server.register('full_checks', () =>
{
	let geth = biapi.connected();
	let ipfs = typeof(ipfsi.ipfsd) !== 'undefined' && ipfsi.ready;

	return Promise.resolve({geth, ipfs});
});

server.register('fully_initialize', (obj) =>
{
	let gethCfg = obj.geth;
	let ipfsCfg = obj.ipfs;
	let gethChk = biapi.connected();
	let ipfsChk = typeof(ipfsi.ipfsd) !== 'undefined' && ipfsi.ready;

	console.log("DEBUG:");
	console.log(obj);
	console.log({gethChk});
	console.log({ipfsChk});

	biapi.setup(gethCfg);
	ipfsi.init(ipfsCfg);

	let reqs = 
	[
		gethChk ? true : biapi.connect(),
		ipfsChk ? true : ipfsi.start().then(() => { return true; })
	];

	return Promise.all(reqs);
});

process.on('SIGINT', () => {
   console.log("\tRPC Server stopping ...");
   if (typeof(ipfsi.controller) !== 'undefined' && ipfsi.controller.started) {
	console.log("\tIPFS Server stopping ...");
	ipfsi.stop().then(() => {
		try{
	        	fs.unlinkSync(path.join(ipfsi.cfsrc.repoPathGo, 'api'));
	        	fs.unlinkSync(path.join(ipfsi.cfsrc.repoPathGo, 'repo.lock'));
		} catch(err) {
			true;
		}
   		server.close();	
   		process.exit(0);
	})
   } else {
   	server.close();	
   	process.exit(0);
   }
})
