import React, { Component } from 'react';
import Reflux from 'reflux';
import Accounts from '../components/Accounts';
import SendTX from '../components/SendTX';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';



class WalletView extends Reflux.Component {
    constructor(props) {
        super(props);

        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;

        this.state = {
            accounts: [
            ],
            queuedTxs: [
            ]

        }

        this._onSelect = this._onSelect.bind(this);
        this.handleEnqueue = this.handleEnqueue.bind(this);
        this.handleDequeue = this.handleDequeue.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleBatchSend = this.handleBatchSend.bind(this);
    }

    componentWillMount() {
        let addrs = CastIronService.getAccounts();
        let addrsWithBalance = addrs.map((addr, index) => (
            {
                name: "account_" + index, 
                addr: addr,
                balance: this.wallet.toEth(this.wallet.addrEtherBalance(addr), this.wallet.TokenList['ETH'].decimals)
            }));
        this.setState((preState) => {
            let state = preState;
            state.accounts = addrsWithBalance;
            state.selected_account = addrs[0];
            return state;
        })

    }

    _onSelect(value) {
        this.setState((preState) => {
            let state = preState;
            state.selected_account = JSON.parse(value.value);
            return state;
        })

    }

    handleEnqueue(tx) {
        this.setState((preState) => {
            let state = preState;
            state.queuedTxs.push(tx);
            return state;
        })
    }

    handleDequeue(tx) {
        this.setState((preState) => {
            let state = preState;
            state.queuedTxs.splice(state.queuedTxs.indexOf(tx), 1);
            return state;
        })
    }

    handleSend(addr, amount, gasNumber) {
        let wallet = CastIronService.wallet;
        wallet.setAccount(this.state.selected_account.addr);
        let weiAmount = wallet.toWei(amount, wallet.TokenList['ETH'].decimals).toString();
        let jobList = [];
        jobList.push(wallet.enqueueTx("ETH")(addr, weiAmount, gasNumber));
        wallet.processJobs(jobList);
        console.log("Send single tx!" + addr + amount + gasNumber)
    }

    handleBatchSend() {
        let wallet = CastIronService.wallet;
        let jobList = [];
        this.state.queuedTxs.map((tx) =>{
            wallet.setAccount(tx.from);
            let weiAmount = wallet.toWei(tx.amount, wallet.TokenList['ETH'].decimals).toString();
            jobList.push(wallet.enqueueTx("ETH")(tx.addr, weiAmount, tx.gasNumber));
        })
       
        wallet.processJobs(jobList);
        console.log("Sending batch txs:");
        console.log(this.state.queuedTxs);
    }

    render() {
        return (
            <div>
                <h1>This is the wallet view!</h1>
                <Accounts accounts={this.state.accounts} selected_account={this.state.selected_account} _onSelect={this._onSelect} />
                <SendTX queuedTxs={this.state.queuedTxs} selected_account={this.state.selected_account}
                    handleEnqueue={this.handleEnqueue} handleDequeue={this.handleDequeue} handleSend={this.handleSend}
                    handleBatchSend={this.handleBatchSend} />
            </div>

        )
    }

}

export default WalletView

