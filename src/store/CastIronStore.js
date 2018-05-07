import BittrexService from '../service/BittrexService';
import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import CastIronService from '../service/CastIronService';
import { createCanvasWithAddress } from "../util/Utils"
import BlockTimer from '../util/BlockTimer'

class CastIronStore extends Reflux.Store {
    constructor() {
        super();
        this.state = {
            accounts: {}
            ,
            queuedTxs: [
            ],
            Qs: [],
            finishedQs: [],
            receipts: {},
            address: null,
            balances: { 'ETH': 0 },
            blockHeight: null,
            blockTime: null,
            gasPrice: null,
            selected_token_name: '',
            currentView : 'Transfer' 
        }
        this.listenables = CastIronActions;
        this.wallet = CastIronService.wallet;
        this.getAccounts = this.getAccounts.bind(this);
        this.state.tokenList = this.wallet.configs.watchTokens || ['OMG'];
        this.wallet.hotGroups(this.state.tokenList);
        this._count;
        this._target;

        // initialize the state
        // this.getAccounts();
        BlockTimer.register(this.updateInfo);
        this.updateInfo()
    }

    onEnqueue(tx) {
        this.state.queuedTxs.push(tx);
        // TODO: figure out why can not use function for this as it will update it multiple times

        this.setState(
           { queuedTxs: this.state.queuedTxs })
    }

    onDequeue(tx) {
        if(this.state.queuedTxs.indexOf(tx) == -1){
            return;
        }
        // this.setState((preState) => {
        //     preState.queuedTxs.splice(preState.queuedTxs.indexOf(tx), 1);
        //     return { queuedTxs: preState.queuedTxs };
        // })
        this.state.queuedTxs.splice(this.state.queuedTxs.indexOf(tx), 1);
        this.setState({ queuedTxs : this.state.queuedTxs})
    }

    onClearQueue() {
        this.setState({queuedTxs : []})
    }

    onSend(addr, type, amount, gasNumber) {
        let wallet = CastIronService.wallet;
        wallet.setAccount(this.state.address);
        let weiAmount = wallet.toWei(amount, wallet.TokenList[type].decimals).toString();
        let jobList = [];
        jobList.push(wallet.enqueueTx(type)(addr, weiAmount, gasNumber));
        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onSendTxInQueue(tx) {
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
        let wallet = CastIronService.wallet;
        wallet.setAccount(this.state.address);

        let jobList = [];
        jobList.push(this.wallet.enqueueTk(tk.type,tk.contract, tk.call,
         tk.args)(tk.txObj.value, tk.txObj.gas, 
         tk.tkObj));
        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onBatchSend() {
        let wallet = CastIronService.wallet;
        let jobList = [];
        this.state.queuedTxs.map((tx) => {
            wallet.setAccount(tx.from);
            let weiAmount = wallet.toWei(tx.amount, wallet.TokenList[tx.type].decimals).toString();
            jobList.push(wallet.enqueueTx(tx.type)(tx.to, weiAmount, tx.gas));
        })

        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise);
        CastIronActions.clearQueue();
    }

    onSelectAccount(value) {
        this.setState(() => {
            return { address: JSON.parse(value.value) };
        })

    }

    onMasterUpdate(value) {
	    this.wallet.masterpw = value;
    }

    onSelectedTokenUpdate(value){
        console.log("in On onSelectedTokenUpdate")
        this.setState(
            { selected_token_name: value }
        )
    }

    onStartUpdate(address, canvas) {
        this._count = 0;
        this._target = this.state.tokenList.length + 1;

        this.wallet.setAccount(address);
        this.setState({ address: address, selected_token_name: '' });

        this.state.tokenList.map((t) => {
            CastIronActions.statusUpdate({ [t]: Number(this.wallet.toEth(this.wallet.addrTokenBalance(t)(this.wallet.userWallet), this.wallet.TokenList[t].decimals).toFixed(9)) });
        });

        CastIronActions.statusUpdate({ 'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) });

        createCanvasWithAddress(canvas, this.state.address);
    }

    onStatusUpdate(status) {
        this._count++;

        this.setState({ balances: { ...this.state.balances, ...status } });

        if (this._count == this._target) CastIronActions.finishUpdate();
    }

    onInfoUpdate(blockHeight, blockTime) {
        this.getAccounts();

        this.wallet.gasPriceEst().then(data => {
            let gasPrice = this.wallet.toEth(data.fast, 9).toString()
            this.setState(() => {
                return { blockHeight: blockHeight, blockTime: blockTime, gasPrice: gasPrice }
            })
        }
            , error => {
            let gasPrice = this.wallet.toEth(this.wallet.configs.defaultGasPrice, 9).toString();
                this.setState(() => {
                    return { blockHeight: blockHeight, blockTime: blockTime, gasPrice: gasPrice }
                })
            });
    }

    onFinishUpdate() {
        console.log(`-|| Account: ${this.state.address} ||-`);
        console.log(JSON.stringify(this.state.balances, 0, 2));
        console.log(`--------------------`);
        // we can perhaps store a copy of the state on disk?
    }

    onAddQ(Q){
        this.setState({Qs:[...this.state.Qs, Q]});
    }

    onChangeView(view){
        this.setState({currentView : view});
    }

    onUpdateReceipts(r){
        let data = r.data;
        if(typeof(this.state.receipts[r.Q]) !== "undefined"){
            data = this.merge(["transactionHash", "tx"], r.data, this.wallet.rcdQ[r.Q]);
        } 
        
        this.setState({receipts : { ...this.state.receipts, ...{[r.Q] : data} }})
    }

    processQPromise = (qPromise) => {
        qPromise.then((Q) => {
            // CastIronService.addQ(Q);
            CastIronActions.addQ(Q);
	    try {
                let r = {
                    Q : Q,
                    data : this.wallet.rcdQ[Q],

                }
                CastIronActions.updateReceipts(r)
              	let batchTxHash = this.wallet.rcdQ[Q].map((o) => (o.tx));
              	console.log("Sending batch txs:");
              	console.log(this.state.queuedTxs);
              	console.log(batchTxHash);
              	return this.wallet.getReceipt(batchTxHash, 30000).then((data) => {return {data,Q}})
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
        let addrs = CastIronService.getAccounts();
        let accounts = {};
        addrs.map((addr, index) => (
            accounts[addr] = {
                name: "account_" + index,
                balance: this.wallet.toEth(this.wallet.addrEtherBalance(addr), this.wallet.TokenList['ETH'].decimals).toFixed(9)
            }
        ));

        if(this.state.address){
            this.setState(() => { return { accounts: accounts, balances: {'ETH' : accounts[this.state.address].balance}}})
            this.state.tokenList.map((t) => {
                CastIronActions.statusUpdate({ [t]: Number(this.wallet.toEth(this.wallet.addrTokenBalance(t)(this.wallet.userWallet), this.wallet.TokenList[t].decimals).toFixed(9)) });
            });
    
            CastIronActions.statusUpdate({ 'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) });
        }else{
            this.setState({accounts: accounts});
        }
    
        console.log(JSON.stringify(this.state, 0, 2));	
    }

    updateInfo = () => {
        this.getAccounts();

        this.wallet.gasPriceEst().then(data => {
            let gasPrice = this.wallet.toEth(data.fast, 9).toString()
            this.setState(() => {
                return { blockHeight: BlockTimer.state.blockHeight, blockTime: BlockTimer.state.blockTime, gasPrice: gasPrice }
            })
        }
            , error => {
            let gasPrice = this.wallet.toEth(this.wallet.configs.defaultGasPrice, 9).toString();
                this.setState(() => {
                    return { blockHeight: BlockTimer.state.blockHeight, blockTime: BlockTimer.state.blockTime, gasPrice: gasPrice }
                })
            });
    }


    // change from https://github.com/ZitRos/array-merge-by-key/blob/master/index.js
    merge(keys, receipt, rcdq) {

        // const array = [];
        // const groups = new Map(); // key => [pos in array, [array, of, objects, with, the, same, key]]
    
        // for (let i = 1; i < arguments.length; ++i) {
        //     for (let j = 0; j < arguments[i].length; ++j) {
        //         const element = arguments[i][j];
        //         if (element.hasOwnProperty(keys[i-1])) {
        //             const keyValue = element[keys[i-1]];
        //             if (groups.has(keyValue)) {
        //                 groups.get(keyValue)[1].push(element);
        //             } else {
        //                 array.push(element);
        //                 groups.set(keyValue, [array.length - 1, []]);
        //             }
        //         } else {
        //             array.push(element);
        //         }
        //     }
        // }
    
        // for (let group of groups) {
        //     if (group[1][1].length === 0)
        //         continue;
        //     array[group[1][0]] =
        //         Object.assign.apply(Object, [{}, array[group[1][0]]].concat(group[1][1]));
        // }
    
        // return array;
        let oout = [];
        rcdq.map((rc) => { receipt.map( (o) => { if (o[keys[0]] === rc[keys[1]]) oout = [...oout, {...rc, ...o}] }) });
        return oout;
    }

}

//  const castIronStore = new CastIronStore()



CastIronStore.id = "CastIronStore";

export default CastIronStore
