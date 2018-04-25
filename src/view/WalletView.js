import React, { Component } from 'react';
import Reflux from 'reflux';
import Accounts from '../components/Accounts';
import SendTX from '../components/SendTX';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';
import Receipts from '../components/Receipts';
import CastIronActions from '../action/CastIronActions'



class WalletView extends Reflux.Component {
    constructor(props) {
        super(props);

        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;
    }


    _onSelect(value) {
       CastIronActions.selectAccount(value);
    }

    handleEnqueue(tx) {
        // CastIronActions.enqueue(tx);
    }

    handleDequeue(tx) {
        CastIronActions.dequeue(tx);
    }

    handleSend(addr, amount, gasNumber) {
        CastIronActions.send(addr, amount, gasNumber);
    }

    handleBatchSend() {
        CastIronActions.batchSend();
    }

   


    render() {
        return (
            <div> 
                <SendTX queuedTxs={this.state.queuedTxs} selected_account={this.state.selected_account}
                    handleEnqueue={this.handleEnqueue} handleDequeue={this.handleDequeue} handleSend={this.handleSend}
                    handleBatchSend={this.handleBatchSend} />
                <Receipts receipts={this.state.receipts} />
            </div>

        )
    }

}

export default WalletView

