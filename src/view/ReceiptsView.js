import React, { Component } from 'react';
import Reflux from 'reflux';
import Accounts from '../components/Accounts';
import SendTX from '../components/SendTX';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';
import Receipts from '../components/Receipts';


class ReceiptsView extends Reflux.Component {
    constructor(props) {
        super(props);

        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;

        this.state = {
            queue: [12, 15],
            receipts: [
            ]
        }

        this.getReceipts = this.getReceipts.bind(this);

    }

    componentWillMount() {
        this.getReceipts();
    }

    getReceipts() {
        CastIronService.state.currentQs.map((Q) => {
            let batchTxHash = this.wallet.rcdQ[Q].map((o) => (o.tx));
            this.wallet.getReceipt(batchTxHash, 30000).then(
                (data) => {
                    console.log("Receipts:")
                    console.log(data);
                    this.setState((preState) => {
                        let state = preState;
                        state.receipts = state.receipts.concat(data);
                        return state;
                    })
                })

        })
    }

    render() {
        return (
            <div>
                <h1>This is the great Receipts view!</h1>
                <Receipts receipts={this.state.receipts}/>
            </div>

        )
    }

}

export default ReceiptsView