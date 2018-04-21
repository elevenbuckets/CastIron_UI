import BittrexService from '../service/BittrexService';
import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import CastIronService from '../service/CastIronService';
import { createCanvasWithAddress } from "../util/Utils"

class CastIronStore extends Reflux.Store {
    constructor() {
        super();
        this.state = {
            accounts: {}
            ,
            queuedTxs: [
            ],
            Qs: [],
            receipts: [],
            address: null,
            balances: { 'ETH': 0 },
            blockHeight: null,
            blockTime: null,
            gasPrice: null,
            selected_token_name: ''
        }
        this.listenables = CastIronActions;
        this.wallet = CastIronService.wallet;
        this.getAccounts = this.getAccounts.bind(this);
        this.state.tokenList = this.wallet.configs.watchTokens || ['OMG'];
        this.wallet.hotGroups(this.state.tokenList);
        this._count;
        this._target;

        // initialize the state
        this.getAccounts();
    }

    onEnqueue(tx) {
        this.setState((preState) => {
            preState.queuedTxs.push(tx);
            return { queuedTxs: preState.queuedTxs };
        })
    }

    onDequeue(tx) {
        this.setState((preState) => {
            preState.queuedTxs.splice(preState.queuedTxs.indexOf(tx), 1);
            return { queuedTxs: preState.queuedTxs };
        })
    }

    onSend(addr, amount, gasNumber) {
        let wallet = CastIronService.wallet;
        wallet.setAccount(this.state.address);
        let weiAmount = wallet.toWei(amount, wallet.TokenList['ETH'].decimals).toString();
        let jobList = [];
        jobList.push(wallet.enqueueTx("ETH")(addr, weiAmount, gasNumber));
        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onBatchSend() {
        let wallet = CastIronService.wallet;
        let jobList = [];
        this.state.queuedTxs.map((tx) => {
            wallet.setAccount(tx.from);
            let weiAmount = wallet.toWei(tx.amount, wallet.TokenList['ETH'].decimals).toString();
            jobList.push(wallet.enqueueTx("ETH")(tx.addr, weiAmount, tx.gasNumber));
        })

        let qPromise = wallet.processJobs(jobList);
        this.processQPromise(qPromise)
    }

    onSelectAccount(value) {
        this.setState(() => {
            return { address: JSON.parse(value.value) };
        })

    }

    onSelectedTokenUpdate(value){
        this.setState(() => {
            return { selected_token_name: value };
        })
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
            let gasPrice = preState.defaultGasPrice
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

    processQPromise(qPromise) {
        qPromise.then((Q) => {
            CastIronService.addQ(Q);
            let batchTxHash = this.wallet.rcdQ[Q].map((o) => (o.tx));
            console.log("Sending batch txs:");
            console.log(this.state.queuedTxs);
            console.log(batchTxHash);
            return this.wallet.getReceipt(batchTxHash, 30000)
        }).then((data) => {
            console.log("Receipts:")
            console.log(data);
            this.setState((preState) => {
                let state = preState;
                state.receipts = state.receipts.concat(data);
                return state;
            })
            this.getAccounts();

        })
    }

    getAccounts() {
        let addrs = CastIronService.getAccounts();
        let accounts = {};
        addrs.map((addr, index) => (
            accounts[addr] = {
                name: "account_" + index,
                balance: this.wallet.toEth(this.wallet.addrEtherBalance(addr), this.wallet.TokenList['ETH'].decimals)
            }
        ));
        this.setState(() => { return { accounts: accounts }})
    }

}

//  const castIronStore = new CastIronStore()



CastIronStore.id = "CastIronStore";

export default CastIronStore
