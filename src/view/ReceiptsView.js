import React, { Component } from 'react';
import Reflux from 'reflux';
import Accounts from '../components/Accounts';
import SendTX from '../components/SendTX';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';
import Receipts from '../components/Receipts';
import Dropdown from 'react-dropdown';
import TxQList from './TxQList';


class ReceiptsView extends Reflux.Component {
    constructor(props) {
        super(props);

        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;
        this.state = {
            selectedQ : ""
        };

        // this.state = {
        //     receipts: [
        //     ]
        // }

        this.getReceipts = this.getReceipts.bind(this);

    }



    componentWillMount() {
        super.componentWillMount();
        // this.getReceipts();
    }

    handleChange = (event) =>{
        this.setState({selectedQ: event.value});
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
        console.log("in ReceiptsView render()");
        return (
            <div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="avatar" style={{ textAlign: "center" }}>
                            <th className="avatar" style={{ textAlign: "center" }}>Receipts</th>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet">
                                <label>
                                    Queues:<Dropdown options={this.state.Qs} onChange={this.handleChange} 
                      value={this.state.selectedQ} placeholder={'Choose a Q id '} />
                                </label>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <Receipts receipts={this.state.receipts}
                 style={{ marginTop: '0', marginBottom: '0', paddingTop: '0', paddingBottom: '0' }} />
            </div>

        )
    }

}

export default ReceiptsView