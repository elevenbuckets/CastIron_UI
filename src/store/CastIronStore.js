import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import CastIronService from '../service/CastIronService';
import AcctMgrService from '../service/AcctMgrService';
import { createCanvasWithAddress } from "../util/Utils"
import BlockTimer from '../util/BlockTimer';
import Scheduler from '../util/Scheduler';
import uuid from 'uuid/v4';
import loopasync from 'loopasync';
const ipcRenderer = require('electron').ipcRenderer;

class CastIronStore extends Reflux.Store {
    constructor() {
        super();
        this.state = {
            accounts: []
            ,
            queuedTxs: [
            ],
            scheduleQueuedTxs: [],
            Qs: [],
	        passManaged: {},
            scheduledQs: [],
            finishedQs: [],
            receipts: {},
            address: null,
            balances: { 'ETH': 0 },
            blockHeight: null,
            blockTime: null,
            highestBlock: 0,
            gasPrice: null,
            selected_token_name: '',
            currentView: 'Transfer',
            retrying: 0,
            rpcfailed: false,
            configured: false,
            userCfgDone: false,
            syncInProgress: false,
            modalIsOpen: false,
            scheduleModalIsOpen: false,
            unlocked: false,
            gasPriceOption: "high",
            customGasPrice: null,
            gasPriceInfo: null,
            lesDelay: false,
	    tokenBalance: []
        }
        this.funcToConfirm = null;
        this.listenables = CastIronActions;
        this.wallet = CastIronService.wallet;
        this.accMgr = AcctMgrService.accMgr;
        this.getAccounts = this.getAccounts.bind(this);
        this.state.tokenList = this.wallet.configs.watchTokens || ['OMG'];

        this._count;
        this._target;
        this.delayTimer;
	this.retryTimer = undefined;

	//speed boost
	this._balances = { 'ETH': 0 };
	this._tokenBalance = [];

        BlockTimer.register(this.updateInfo);
        this.updateInfo()
	
	ipcRenderer.send('tokenlist', this.state.tokenList);
    }

    onInitPlatform() {
        console.log('Re-init platform');
        this.setState({ retrying: 1, rpcfailed: false, configured: false });
        BlockTimer.state.initialized = false;
        this.updateInfo();
    }

    onEnqueue(tx) {
        this.state.queuedTxs.push(tx);
        // TODO: figure out why can not use function for this as it will update it multiple times

        this.setState(
            { queuedTxs: this.state.queuedTxs })
    }


    onEnqueueSchedule(tx) {
        this.state.scheduleQueuedTxs.push(tx);
        this.setState(
            { scheduleQueuedTxs: this.state.scheduleQueuedTxs })
    }

    onDequeue(tx) {
        if (this.state.queuedTxs.indexOf(tx) == -1) {
            return;
        }
        // this.setState((preState) => {
        //     preState.queuedTxs.splice(preState.queuedTxs.indexOf(tx), 1);
        //     return { queuedTxs: preState.queuedTxs }; this.setState({ modalIsOpen: true });
        // })
        this.state.queuedTxs.splice(this.state.queuedTxs.indexOf(tx), 1);
        this.setState({ queuedTxs: this.state.queuedTxs })
    }

    onDequeueSchedule(tx) {
        if (this.state.scheduleQueuedTxs.indexOf(tx) == -1) {
            return;
        }
        this.state.scheduleQueuedTxs.splice(this.state.scheduleQueuedTxs.indexOf(tx), 1);
        this.setState({ scheduleQueuedTxs: this.state.scheduleQueuedTxs })
    }

    onClearQueue() {
        this.setState({ queuedTxs: [] })
    }
    onClearQueueSchedule() {
        this.setState({ scheduleQueuedTxs: [] })
    }

    onSend(fromAddr, addr, type, amount, gasNumber) {
        this.confirmTxs(this.send, arguments);
    }

    send(fromAddr, addr, type, amount, gasNumber) {
        let wallet = CastIronService.wallet;
        wallet.setAccount(fromAddr);
        let weiAmount = wallet.toWei(amount, wallet.TokenList[type].decimals).toString();
        let jobList = [];
        jobList.push(wallet.enqueueTx(type)(addr, weiAmount, gasNumber));
        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onSchedule(fromAddr, addr, type, amount, gasNumber) {
        let tx = { from: fromAddr, to: addr, type, amount, gas: gasNumber };
        this.setUpSchedule(this.batchSend.bind(this), [[tx]]);
    }


    onScheduleTxInQueue(tx) {
        this.setUpSchedule(this.batchSend.bind(this), [[tx]], CastIronActions.dequeueSchedule, arguments);
    }

    onSendTxInQueue(tx) {
        this.confirmTxs(this.sendTxInQueue, arguments);
    }

    sendTxInQueue(tx) {
        CastIronActions.dequeue(tx);
        let wallet = CastIronService.wallet;
        wallet.setAccount(tx.from);
        let weiAmount = wallet.toWei(tx.amount, wallet.TokenList[tx.type].decimals).toString();
        let jobList = [];
        jobList.push(wallet.enqueueTx(tx.type)(tx.to, weiAmount, tx.gas));
        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onSendTk(tk) {
        this.confirmTxs(this.sendTk, arguments);
    }

    sendTk(tk) {
        let wallet = CastIronService.wallet;
        wallet.setAccount(this.state.address);

        let jobList = [];
        jobList.push(this.wallet.enqueueTk(tk.type, tk.contract, tk.call,
            tk.args)(tk.txObj.value, tk.txObj.gas,
                tk.tkObj));
        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onSendTks(tks) {
        this.confirmTxs(this.sendTks, arguments);
    }

    sendTks(tks) {
        let wallet = CastIronService.wallet;
        wallet.setAccount(this.state.address);
        let gasPrice = this.wallet.gasPrice;
        let length = tks.length;
        let jobList = tks.map((tk, index) => {
            this.wallet.gasPrice = this.wallet.web3.toBigNumber(gasPrice).add(this.wallet.web3.toBigNumber(length - 1 - index).mul(1000000000));
            return this.wallet.enqueueTk(tk.type, tk.contract, tk.call,
                tk.args)(tk.txObj.value, tk.txObj.gas,
                    tk.tkObj);
        })

        this.wallet.gasPrice = gasPrice;

        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onBatchSend() {
        this.confirmTxs(this.batchSend, [this.state.queuedTxs],
            CastIronActions.clearQueue, arguments);
    }

    onBatchSchedule() {
        this.setUpSchedule(this.batchSend.bind(this), [this.state.scheduleQueuedTxs],
            CastIronActions.clearQueueSchedule, arguments);
    }

    batchSend(queuedTxs) {
        let wallet = CastIronService.wallet;
        let jobList = [];
        queuedTxs.map((tx) => {
            wallet.setAccount(tx.from);
            let weiAmount = wallet.toWei(tx.amount, wallet.TokenList[tx.type].decimals).toString();
            jobList.push(wallet.enqueueTx(tx.type)(tx.to, weiAmount, tx.gas));
        })

        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise);
    }

    onSelectAccount(value) {
        this.setState(() => {
            return { address: JSON.parse(value.value) };
        })

    }

    onMasterUpdate(value) {
        this.wallet.password(value);
        this.accMgr.password(value);
	ipcRenderer.send('awaken', value);
	this.wallet.setAccount(null);
        this.wallet.validPass().then((r) => { this.setState({ unlocked: r, address: null, tokenBalance: [], balances: {'ETH': 0} }); });
    }

    onSelectedTokenUpdate(value) {
        console.log("in On onSelectedTokenUpdate")
        this.setState(
            { selected_token_name: value }
        )
    }

    onStartUpdate(address, canvas) {
	clearTimeout(this.retryTimer); this.retryTimer = undefined;
	if (BlockTimer.state.blockHeight != this.state.blockHeight) {
		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!retrying status update soon...")
        	this.setState({ address: address, lesDelay: true, tokenBalance: [] });
       		createCanvasWithAddress(canvas, this.state.address);
		this.retryTimer = setTimeout(() => { return CastIronActions.startUpdate(address, canvas) }, 997);
		return
	}

        this._count = 0;
        this._target = this.state.tokenList.length + 1;
	this._balances = {'ETH': 0 };
	this._tokenBalance = [];

	let stage = Promise.resolve();

	stage = stage.then(() => {
        	this.setState({ address: address, lesDelay: true, tokenBalance: [] });
       		createCanvasWithAddress(canvas, this.state.address);
	})
	.then(() => { return this.wallet.managedAddress(address) })
	.then((obj) => {
        	this.wallet.setAccount(address);
        	this.setState({ passManaged: obj });
       

		/*
    	   	CastIronActions.statusUpdate({ 
			    'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) 
        	});
       		this.state.tokenList.map((t) => {
       			CastIronActions.statusUpdate({ 
			    [t]: Number(this.wallet.toEth(this.wallet.addrTokenBalance(t)(this.wallet.userWallet), this.wallet.TokenList[t].decimals).toFixed(9)) 
			});
       		});
		*/
		loopasync(['ETH', ...this.state.tokenList], CastIronActions.statusUpdate, 1);
	})

	return stage;
    }

    addressUpdate = () => {
	if (this.state.lesDelay === true) return; // do nothing, since statusUpdate is doing it already
        this._count = 0;
        this._target = this.state.tokenList.length + 1;
	this._balances = {'ETH': 0 };
	this._tokenBalance = [];

	let stage = Promise.resolve();

	stage = stage.then(() => {return this.wallet.managedAddress(this.state.address) })
		.then((obj) => {
        		this.wallet.setAccount(this.state.address);
			this.setState({passManaged: obj});
			loopasync(['ETH', ...this.state.tokenList], CastIronActions.statusUpdate, 1);
			/*
        		CastIronActions.statusUpdate({ 
				'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) 
			});

        		this.state.tokenList.map((t) => {
            			CastIronActions.statusUpdate({ 
		    	    	    [t]: Number(this.wallet.toEth(this.wallet.addrTokenBalance(t)(this.wallet.userWallet), this.wallet.TokenList[t].decimals).toFixed(9)) 
	    			});
        		});
			*/
		});

	return stage;
    }

    onStatusUpdate(symbol) {
        this._count++;
	let b;

	if (symbol != 'ETH') {
	   b = Number(this.wallet.toEth(this.wallet.addrTokenBalance(symbol)(this.wallet.userWallet), this.wallet.TokenList[symbol].decimals).toFixed(9));
	} else {
	   b = Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9));
	}

	let status = {[symbol]: b};

	if (b > 0 && symbol != 'ETH') {
		let a = [ ...this._tokenBalance, `${symbol}: ${b}`];
		this._balances = { ...this._balances, ...status };
		this._tokenBalance = [ ...new Set(a)];
        	//this.setState({ balances: { ...this.state.balances, ...status }, tokenBalance: [ ...new Set(a)] });
	} else {
		this._balances = { ...this._balances, ...status };
        	//this.setState({ balances: { ...this.state.balances, ...status } });
	}

        if (this._count == this._target) CastIronActions.finishUpdate();
    }

    onInfoUpdate() {
        this.getAccounts();
    }

    onFinishUpdate() {
        this.setState({lesDelay: false, balances: this._balances, tokenBalance: this._tokenBalance });
	this._balances = {'ETH': 0 };
	this._tokenBalance = [];
        //console.log(`-|| Account: ${this.state.address} ||-`);
        //console.log(JSON.stringify(this.state.balances, 0, 2));
        //console.log(`--------------------`);
        // we can perhaps store a copy of the state o CastIronActions.clearQueue();n disk?
    }

    onAddQ(Q) {
        this.setState({ Qs: [...this.state.Qs, Q] });
    }

    onChangeView(view) {
        this.setState({ currentView: view });
    }

    onUpdateReceipts(r) {
        let data = r.data;
        if (typeof (this.state.receipts[r.Q]) !== "undefined") {
            data = this.merge(["transactionHash", "tx"], r.data, this.wallet.rcdQ[r.Q]);
        }

        data.map((d) => {
            if (!d.tx) {
                d.tx = "0x0000000000000000000000000000000000000000000000000000000000000000";
            }
        })

        this.setState({ receipts: { ...this.state.receipts, ...{ [r.Q]: data } } })
    }

    onGasPriceOptionSelect(option) {
        let stage = Promise.resolve(this.setState({ gasPriceOption: option }))
        stage.then(() => {
            let gasPrice;
            if (option === "custom" && this.state.customGasPrice) {
                gasPrice = this.wallet.toWei(this.state.customGasPrice, 9).toString();
            } else if (option != "custom") {
                gasPrice = this.state.gasPriceInfo[option];
            } else {
                return;
            }

            this.setGasPrice(gasPrice);
        })
    }

    onCustomGasPriceUpdate(price) {
        if (!price) {
            price = 0;
        }
        let stage = Promise.resolve(this.setState({ customGasPrice: price }))
        stage.then(() => {
            if (this.state.customGasPrice) {
                let gasPrice = this.wallet.toWei(parseFloat(this.state.customGasPrice).toString(), 9).toString();
                this.setGasPrice(gasPrice);
            }
        }

        );

    }

    onWatchedTokenUpdate(action, tokenSymbol){
        let watchedTokens = this.state.tokenList;   
        if(action === "Add"){
            if(watchedTokens.includes(tokenSymbol)){
                return;
            }else{
                watchedTokens = [...watchedTokens, tokenSymbol];
                this.setState({tokenList : watchedTokens});
                this.wallet.hotGroups(watchedTokens);
            }
        }else if(action ==="Remove"){
            if(!watchedTokens.includes(tokenSymbol)){
                return;
            }else{
                watchedTokens.splice(watchedTokens.indexOf(tokenSymbol), 1);
                this.setState({tokenList : watchedTokens});
                //this.wallet.hotGroups(watchedTokens); //remove watch doesn't mean we need to unbind its ERC20 contract
            }
        }
	ipcRenderer.send('tokenlist', watchedTokens);
    }

    processQPromise = (qPromise) => {
        qPromise.then((Q) => {
            // CastIronService.addQ(Q);
            CastIronActions.addQ(Q);
            try {
                let r = {
                    Q: Q,
                    data: this.wallet.rcdQ[Q],

                }
                CastIronActions.updateReceipts(r)
                let batchTxHash = this.wallet.rcdQ[Q].map((o) => (o.tx));
                console.log("Sending batch txs:");
                console.log(this.state.queuedTxs);
                console.log(batchTxHash);
                return this.wallet.getReceipt(batchTxHash, 11000).then((data) => { return { data, Q } })
            } catch (err) {
                console.log("ERROR in processQPromise: " + err);
                console.log("rcdQ: " + Q + ">>");
                console.log(JSON.stringify(this.wallet.rcdQ[Q]));
                console.log("jobQ: " + Q + ">>");
                console.log(JSON.stringify(this.wallet.jobQ[Q]));
                return Promise.resolve([]);
            }
        }).then((r) => {
            console.log("Receipts:")
            console.log(r.data);
            CastIronActions.updateReceipts(r);
        })
    }

    processQReadPromise = (qPromise) => {
        qPromise.then((Q) => {
            // CastIronService.addQ(Q);
            CastIronActions.addQ(Q);
            try {
                let r = {
                    Q: Q,
                    data: this.wallet.rcdQ[Q],

                }
                CastIronActions.updateReceipts(r)
                let batchTxHash = this.wallet.rcdQ[Q].map((o) => (o.tx));
                console.log("Sending batch txs:");
                console.log(this.state.queuedTxs);
                console.log(batchTxHash);
                return this.wallet.getReceipt(batchTxHash, 30000).then((data) => { return { data, Q } })
            } catch (err) {
                console.log("ERROR in processQPromise: " + err);
                console.log("rcdQ: " + Q + ">>");
                console.log(JSON.stringify(this.wallet.rcdQ[Q]));
                console.log("jobQ: " + Q + ">>");
                console.log(JSON.stringify(this.wallet.jobQ[Q]));
                return Promise.resolve([]);
            }
        }).then((r) => {
            console.log("Receipts:")
            console.log(r.data);
            CastIronActions.updateReceipts(r);
        })
    }

    getAccounts() {
	return Promise.resolve().then(() => {
            let addrs = CastIronService.getAccounts();
            if (addrs.length !== this.state.accounts.length) this.setState({ accounts: addrs });

	    if (this.state.address !== null) {
		    return this.addressUpdate();
	    } else {
		    this.setState({balances: {'ETH': 0 }, selected_token_name: '' });
	    }
        })
    }

    updateInfo = () => {
        let stage = Promise.resolve();

        if (!this.wallet.configured()) {
            return this.setState({ configured: false });
        } else if (!this.state.configured) {
            this.setState({ configured: true });
        }

        const __delay = (t, v) => { return new Promise((resolve) => { setTimeout(resolve.bind(null, v), t) }); }
        const __reconnect = (p, trial, retries) => { // p: promise, trial: current retry, retries: max retry times
            return p
                .then(() => { return this.wallet.connect(); })
                .then((rc) => {
                    if (!rc && trial < retries) {
                        trial++;
                        console.log(`retrying (${trial}/${retries})`);
                        this.setState({ retrying: trial })
                        return __delay(5000, null).then(() => { return __reconnect(p, trial, retries); });
                    } else if (!rc && trial >= retries) {
                        throw ("Please check your geth connection");
                    } else if (rc) {
			if (this.state.retrying !== 0 || this.state.rpcfailed !== false) {
                        	this.setState({ retrying: 0, rpcfailed: false });
			}
                        return p;
                    }
                })
                .catch((err) => { this.setState({ rpcfailed: true }); throw (err); });
        }

        const __gasPriceQuery = (p) => {
            return p
                .then(() => { return this.wallet.gasPriceEst().catch((err) => { return {}; }) })
                .then((data) => {
                    if (Object.keys(data).length === 0) {
                        console.log("gas price query failed, using default gas prices");
                        let gasPriceInfo = { low: '5000000000', mid: '9000000000', high: '15000000000', fast: '20000000000' }; // should from config.json
                        return this.setState({ gasPriceInfo });
                    } else {
                        let gasPriceInfo = {};
                        gasPriceInfo.low = data.low.toString();
                        gasPriceInfo.mid = data.mid.toString();
                        gasPriceInfo.high = data.high.toString();
                        gasPriceInfo.fast = data.fast.toString();

                        return this.setState({ gasPriceInfo });
                    }
                })
        }

        // Actual function logic of updateInfo
        if (this.state.gasPriceOption !== "custom") stage = __gasPriceQuery(stage);
        stage.then(() => {
            if (this.state.gasPriceOption !== "custom") {
                let gasPrice = this.state.gasPriceInfo[this.state.gasPriceOption]
                this.setGasPrice(gasPrice);
            } else if (this.state.customGasPrice) {
                let gasPrice = this.wallet.toWei(parseFloat(this.state.customGasPrice).toString(), 9).toString();
                this.setGasPrice(gasPrice);
            }
        });
        stage = __reconnect(stage, 0, 3);
        stage.then(() => {
            // BlockTimer needs to *NOT* querying geth RPC in constructor, but in separated class function!!!
            // Since it is possible that CastIron cannot connect to RPC!
            BlockTimer.initialize();
            if(this.state.tokenList.length > 0) this.wallet.hotGroups(this.state.tokenList);
	    let syncInProgress = false;
	    if (
		  BlockTimer.state.blockHeight !== BlockTimer.state.highestBlock 
	       || BlockTimer.state.highestBlock == 0
	       || (this.wallet.web3.net.peerCount == 0 && this.wallet.web3.eth.mining === false)
	    )
	    {
		    syncInProgress = true;
	    }
	    return this.setState({ blockHeight: BlockTimer.state.blockHeight, highestBlock: BlockTimer.state.highestBlock, blockTime: BlockTimer.state.blockTime, syncInProgress });
        })
            .then(() => { return this.getAccounts(); })
    }

    // to confirm tx in modal
    onConfirmTx() {
        this.setState({ modalIsOpen: false });
        if (this.funcToConfirm) {
            this.funcToConfirm(...this.argsToConfirm);
            this.funcToConfirm = null;
            this.argsToConfirm = [];
        }

        if (this.funcAfterConfirmTx) {
            this.funcAfterConfirmTx(...this.argsAfterConfirmTx);
            this.funcAfterConfirmTx = null;
            this.argsAfterConfirmTx = [];
        }
    }

    // to cancel tx in modal
    onCancelTx() {
        this.setState({ modalIsOpen: false });
        this.funcToConfirm = null;
        this.argsToConfirm = [];
    }

    // Open confirm modal for tx sending
    confirmTxs = (func, args, afterConfirmFunc, afterConfirmArgs) => {
        this.setState({ modalIsOpen: true });
        this.funcToConfirm = func;
        this.argsToConfirm = args;
        this.funcAfterConfirmTx = afterConfirmFunc;
        this.argsAfterConfirmTx = afterConfirmArgs;
    }

    // to confirm schedule tx in modal
    onConfirmScheduleTx(queue) {

        this.setState({ scheduleModalIsOpen: false });
        if (this.funcToScheudle) {
            let Qid = uuid();
            queue.Qid = Qid;
            queue.func = this.funcToScheudle;
            queue.args = this.argsToSchedule;
            queue.status = "Scheduled";
            let __queue = { ...queue }
            Scheduler.schedule(__queue);

            this.state.scheduledQs.push(__queue);
            this.setState({ scheduledQs: this.state.scheduledQs })
            this.funcToScheudle = null;
            this.argsToSchedule = [];
        }

        if (this.funcAfterConfirmSchedule) {
            this.funcAfterConfirmSchedule(...this.argsAfterConfirmSchedule);
            this.funcAfterConfirmSchedule = null;
            this.argsAfterConfirmSchedule = [];
        }
    }

    // to cancel schedule tx in modal
    onCancelScheduleTx() {
        this.setState({ scheduleModalIsOpen: false });
        this.funcToScheudle = null;
        this.argsToSchedule = [];
    }


    // Open Schedular modal for tx sending
    setUpSchedule = (func, args, afterConfirmFunc, afterConfirmArgs) => {
        this.setState({ scheduleModalIsOpen: true });
        this.funcToScheudle = func;
        this.argsToSchedule = args;
        this.funcAfterConfirmSchedule = afterConfirmFunc;
        this.argsAfterConfirmSchedule = afterConfirmArgs;
    }

    onDeleteScheduledQ(Q) {
        if (this.state.scheduledQs.indexOf(Q) != -1) {
            this.state.scheduledQs.splice(this.state.scheduledQs.indexOf(Q), 1);
        }
        this.setState({ scheduledQs: this.state.scheduledQs })
    }

    onDeleteScheduledQs(Qs) {
        Qs.map(Q => {
            if (this.state.scheduledQs.indexOf(Q) != -1) {
                this.state.scheduledQs.splice(this.state.scheduledQs.indexOf(Q), 1);
            }
        })

        this.setState({ scheduledQs: this.state.scheduledQs })
    }





    merge(keys, receipt, rcdq) {
        let oout = [];
        rcdq.map((rc) => { receipt.map((o) => { if (o[keys[0]] === rc[keys[1]]) oout = [...oout, { ...rc, ...o }] }) });
        return oout;
    }

    // Set gas price for both wallet and state, arg gagPrice is with unit Wei, 
    setGasPrice = gasPrice => {
        this.wallet.gasPrice = gasPrice;
        this.setState({ gasPrice: gasPrice });
	ipcRenderer.send('gasprice', gasPrice);
    }

}



CastIronStore.id = "CastIronStore";

export default CastIronStore
