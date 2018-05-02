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
            selectedQ: ""
        };


        this.getReceipts = this.getReceipts.bind(this);

    }


    handleChange = (event) => {
        this.setState({ selectedQ: event.value });
    }

    getReceipts = () => {
        return this.state.receipts[this.state.selectedQ]
    }

    render() {
        console.log("in ReceiptsView render()");
        return (
            <div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="avatar" style={{ textAlign: "center" }}>
                            <th colSpan="2" className="avatar" style={{ textAlign: "center" }}>Receipts</th>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet" width="17%">Queue IDs:</td>
                            <td className="balance-sheet">
                                <Dropdown options={this.state.Qs} onChange={this.handleChange}
                                    value={this.state.selectedQ} placeholder={'Please select a Queue ID'} />
                            </td>
                        </tr>

                    </tbody>
                </table>
                <Receipts receipts={this.getReceipts()}
                    style={{ marginTop: '0', marginBottom: '0', paddingTop: '0', paddingBottom: '0' }} />
            </div>

        )
    }

}

export default ReceiptsView
