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
            currentView: 'Transfer',
            modalIsOpen: false,
            unlocked: false,
            gasPriceOption: "high",
            customGasPrice : null
        }
        this.funcToConfirm = null;
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

    onClearQueue() {
        this.setState({ queuedTxs: [] })
    }

    onSend(addr, type, amount, gasNumber) {
        this.confirmTxs(this.send, arguments);
    }
    send(addr, type, amount, gasNumber) {
        let wallet = CastIronService.wallet;
        wallet.setAccount(this.state.address);
        let weiAmount = wallet.toWei(amount, wallet.TokenList[type].decimals).toString();
        let jobList = [];
        jobList.push(wallet.enqueueTx(type)(addr, weiAmount, gasNumber));
        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
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

        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onBatchSend() {
        this.confirmTxs(this.batchSend, arguments);
    }
    batchSend() {
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
        this.wallet.password(value);
        this.wallet.validPass().then((r) => { this.setState({ unlocked: r }); });
    }

    onSelectedTokenUpdate(value) {
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
        CastIronActions.changeView('Transfer');
    }

    onAddressUpdate(address, canvas) {
        this._count = 0;
        this._target = this.state.tokenList.length + 1;
        this.wallet.setAccount(address);
        this.setState({ address: address });
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
            this.setState(
                { blockHeight: blockHeight, blockTime: blockTime, gasPrice: gasPrice }
            )
        }
            , error => {
                let gasPrice = this.wallet.toEth(this.wallet.configs.defaultGasPrice, 9).toString();
                this.setState(
                    { blockHeight: blockHeight, blockTime: blockTime, gasPricconfirmTXe: gasPrice }
                )
            });
    }

    onFinishUpdate() {
        console.log(`-|| Account: ${this.state.address} ||-`);
        console.log(JSON.stringify(this.state.balances, 0, 2));
        console.log(`--------------------`);
        // we can perhaps store a copy of the state on disk?
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

        this.setState({ receipts: { ...this.state.receipts, ...{ [r.Q]: data } } })
    }

    onGasPriceOptionSelect(option) {
        let stage = Promise.resolve(this.setState({ gasPriceOption: option }))
        stage.then(() => {
            this.updateInfo();
        }

        );

    }

    onCustomGasPriceUpdate(price) {
        let stage = Promise.resolve(this.setState({ customGasPrice: price }))
        stage.then(() => {
            this.updateInfo();
        }

        );

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
        let addrs = CastIronService.getAccounts();
        let accounts = {};
        addrs.map((addr, index) => (
            accounts[addr] = {
                name: "account_" + index,
                balance: this.wallet.toEth(this.wallet.addrEtherBalance(addr), this.wallet.TokenList['ETH'].decimals).toFixed(9)
            }
        ));

        if (this.state.address) {
            this.setState(() => { return { accounts: accounts, balances: { 'ETH': accounts[this.state.address].balance } } })
            this.state.tokenList.map((t) => {
                CastIronActions.statusUpdate({ [t]: Number(this.wallet.toEth(this.wallet.addrTokenBalance(t)(this.wallet.userWallet), this.wallet.TokenList[t].decimals).toFixed(9)) });
            });

            CastIronActions.statusUpdate({ 'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) });
        } else {
            this.setState({ accounts: accounts });
        }

        console.log(JSON.stringify(this.state, 0, 2));
    }

    updateInfo = () => {
        this.getAccounts();

        this.wallet.gasPriceEst().then(data => {
            if (this.state.gasPriceOption != "custom") {
                let gasPrice = this.wallet.toEth(data[this.state.gasPriceOption], 9).toString();
                this.wallet.gasPrice = data[this.state.gasPriceOption];
                this.setState(
                    { blockHeight: BlockTimer.state.blockHeight, blockTime: BlockTimer.state.blockTime, gasPrice: gasPrice }
                )
            } else {
                if(this.state.customGasPrice){
                    this.wallet.gasPrice = this.wallet.toWei(this.state.customGasPrice, 9);
                }
                this.setState(
                    { blockHeight: BlockTimer.state.blockHeight, blockTime: BlockTimer.state.blockTime, gasPrice : this.state.customGasPrice }
                )
            }


        }
            , error => {
                let gasPrice = this.wallet.toEth(this.wallet.configs.defaultGasPrice, 9).toString();
                this.wallet.gasPrice = this.wallet.configs.defaultGasPrice;
                this.setState(() => {
                    return { blockHeight: BlockTimer.state.blockHeight, blockTime: BlockTimer.state.blockTime, gasPrice: gasPrice }
                })
            });
    }

    // to confirm tx in modal
    onConfirmTx() {
        this.setState({ modalIsOpen: false });
        if (this.funcToConfirm) {
            this.funcToConfirm(...this.argsToConfirm);
            this.funcToConfirm = null;
            this.argsToConfirm = [];
        }
    }

    // to cancel tx in modal
    onCancelTx() {
        this.setState({ modalIsOpen: false });
        this.funcToConfirm = null;
        this.argsToConfirm = [];
    }

    confirmTxs = (func, args) => {
        this.setState({ modalIsOpen: true });
        this.funcToConfirm = func;
        this.argsToConfirm = args;
    }



    merge(keys, receipt, rcdq) {
        let oout = [];
        rcdq.map((rc) => { receipt.map((o) => { if (o[keys[0]] === rc[keys[1]]) oout = [...oout, { ...rc, ...o }] }) });
        return oout;
    }

    render() {
        <canvas ref='canvas' width={66} height={66} style=
            {
                {
                    border: "3px solid #ccc",
                    borderBottomLeftRadius: "2.8em",
                    borderBottomRightRadius: "2.8em",
                    borderTopRightRadius: "2.8em",
                    borderTopLeftRadius: "2.8em"
                }
            }
        />
    }

}



CastIronStore.id = "CastIronStore";

export default CastIronStore
