import React, { Component } from 'react';
import Reflux from 'reflux';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';
import Receipt from './Receipt';
import Constants from '../util/Constants'


class Receipts extends Reflux.Component {
    constructor(props) {
        super(props);

        this.clearTout = undefined;
    }

    simplifyTxHash = (content) => {
        if (content) {
            let res = content.substring(0, 5);
            res = res + "...";
            let length = content.length;
            res = res + content.substring(length - 5, length);
            return res;
        } else {
            return null;
        }

    }

    getType(receipt) {
        if (Constants.Token === receipt.type || Constants.Web3 === receipt.type) {
            return receipt.contract;
        }
        return "Function"
    }

    getAmount(receipt) {
        if (Constants.Web3 === receipt.type && Constants.ETH === receipt.contract) {
            return CastIronService.wallet.toEth(CastIronService.wallet.hex2num(receipt.value),
                CastIronService.wallet.TokenList[Constants.ETH].decimals).toFixed(9);
        } else if (Constants.Token === receipt.type) {
            return CastIronService.wallet.toEth(CastIronService.wallet.hex2num(receipt.amount),
                CastIronService.wallet.TokenList[receipt.contract].decimals).toFixed(9);
        }
        return receipt.amount;
    }

    getGasPrice = (receipt) => {
        return CastIronService.wallet.toEth(CastIronService.wallet.hex2num(receipt.gasPrice), 9).toFixed(9);
    }

    getStatus(receipt) {
        if (receipt.status === "0x0") {
            return Constants.Failed;
        } else if (receipt.status === "0x1") {
            return Constants.Succeeded;
        } else if (receipt.error) {
            return Constants.Errored;
        }
        return Constants.Pending;
    }

    infoDisplay(name, data) {
        event.preventDefault(); // is this necessary?
        clearTimeout(this.clearTout);
        this.refs.infocache.value = name + ': ' + data;
    }

    infoClear() {
        this.clearTout = setTimeout(() => { this.refs.infocache.value = '' }, 5000);
    }

    getStatusComponent = (receipt) => {
        let status = this.getStatus(receipt);

        return <td className="balance-sheet"
            onMouseEnter={status==Constants.Errored ? this.infoDisplay.bind(this, 'Erorr Info ', receipt.error) : () =>{} }
            onMouseLeave={status==Constants.Errored ? this.infoClear.bind(this):() =>{} } width='8%'>{status}</td>
    }

    receipts = () => {
        if (this.props.receipts) {
            return this.props.receipts.map((receipt) => {
                return (
                    <tr className="balance-sheet">
                        <td className="balance-sheet"
                            onMouseEnter={this.infoDisplay.bind(this, 'txHash', receipt.tx)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.tx)}</td>
                        <td className="balance-sheet"
                            onMouseEnter={this.infoDisplay.bind(this, 'From', receipt.from)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.from)}</td>
                        <td className="balance-sheet"
                            onMouseEnter={this.infoDisplay.bind(this, 'To', receipt.to)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.to)}</td>
                        <td className="balance-sheet" width='8%'>{this.getType(receipt)}</td>
                        <td className="balance-sheet" width='8%'>{this.getAmount(receipt)}</td>
                        <td className="balance-sheet" width='8%'>{receipt.gasUsed}</td>
                        <td className="balance-sheet" width='8%'>{this.getGasPrice(receipt)}</td>
                        <td className="balance-sheet" width='8%'>{receipt.blockNumber}</td>
                        {this.getStatusComponent(receipt)}
                    </tr>
                );
            })
        }
    }

    render() {

        return (
            <div style={{ overflow: 'scroll', margin: '0', maxHeight: "490px", height: '490px' }} >
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <th className="balance-sheet" style={{ color: '#111111' }} width='10%'>TxHash</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='10%'>From</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='10%'>To</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='8%'>Type</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='8%'>Amount</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='8%'>Gas</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='8%'>Gas Price</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='8%'>Block No.</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='8%'>Status</th>
                        </tr>
                        {this.receipts()}
                    </tbody>
                </table>
                <div style=
                    {
                        {
                            textAlign: 'center',
                            backgroundColor: '#ffffff',
                            width: '99.5%',
                            maxHeight: '58',
                            minHeight: '58',
                            zIndex: '2',
                            position: "fixed",
                            bottom: '21%',
                            boxShadow: '0 -5px 6px -5px rgba(200,200,200,0.5)'
                        }
                    }>
                    <input type='text' style={{ paddingTop: '15px', fontFamily: 'monospace', border: 0, width: '85%', fontSize: '1.11em', textAlign: 'center' }} align='center' ref='infocache' value='' />
                </div>
            </div>
        )
    }


}

export default Receipts
