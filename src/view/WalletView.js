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

        this.state = {
            accounts: [
                { name: "account_1", addr: "0xd12Cd8A37F074e7eAFae618C986Ff825666198bd", balance: 10 },
                { name: "account_2", addr: "0x6f46cf5569aefa1acc1009290c8e043747172d89", balance: 15 }
            ],

            selected_account: { name: "account_1", addr: "0xd12Cd8A37F074e7eAFae618C986Ff825666198bd", balance: 10 },
            blockHeight : 120000,
            unixTime : 123213,
            localTime : null ,
            blockTimeStamp: null,
            gasPrice : 20,

            queuedTxs : [
                {
                    from: "0xd12Cd8A37F074e7eAFae618C986Ff825666198bd",
                    addr: "0x90e63c3d53e0ea496845b7a03ec7548b70014a91",
                    amount: "2",
                    gasNumber: "150000"
                },
                { 
                    from: "0xd12Cd8A37F074e7eAFae618C986Ff825666198bd",
                    addr: "0x53d284357ec70ce289d6d64134dfac8e511c8a3d",
                    amount: "6",
                    gasNumber: "150000"
                }
            ]

        }

        this._onSelect = this._onSelect.bind(this);
        this.handleEnqueue = this.handleEnqueue.bind(this);
        this.handleDequeue = this.handleDequeue.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleBatchSend = this.handleBatchSend.bind(this);
    }

    _onSelect(value){
        this.setState((preState)=>{
            let state = preState;
            state.selected_account = JSON.parse(value.value);
            return state;
        })
       
    }

    handleEnqueue(tx){
        this.setState((preState)=>{
            let state = preState;
            state.queuedTxs.push(tx);
            return state;
        })
    }

    handleDequeue(tx){
        this.setState((preState)=>{
            let state = preState;
            state.queuedTxs.splice(state.queuedTxs.indexOf(tx),1);
            return state;
        })
    }

    handleSend(addr, amount, gasNumber){
        alert("Send single tx!")
    }

    handleBatchSend(){
        alert("Send batch txes!")
    }

    render() {
        return (
            <div>
                <h1>This is the wallet view!</h1>
                <Accounts accounts={this.state.accounts} selected_account = {this.state.selected_account} _onSelect ={this._onSelect}/>
                <SendTX queuedTxs = {this.state.queuedTxs} selected_account = {this.state.selected_account} 
                handleEnqueue={this.handleEnqueue} handleDequeue={this.handleDequeue} handleSend={this.handleSend}
                handleBatchSend={this.handleBatchSend}/>
            </div>

        )
    }

}

export default WalletView

