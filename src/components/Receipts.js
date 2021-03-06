"use strict";

// Third-parties
import React, { Component } from 'react';
import Reflux from 'reflux';

// Reflux store
import CastIronStore from '../store/CastIronStore';

// Singleton sservice
import CastIronService from '../service/CastIronService';

// Components
import Receipt from './Receipt';

// Utils
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

        return <td 
            onMouseEnter={status==Constants.Errored ? this.infoDisplay.bind(this, 'Erorr Info ', receipt.error) : () =>{} }
            onMouseLeave={status==Constants.Errored ? this.infoClear.bind(this):() =>{} } width='8%'>{status}</td>
    }

    receipts = () => {
        if (this.props.receipts) {
            return this.props.receipts.map((receipt) => {
                return (
                    <tr >
                        <td 
                            onMouseEnter={this.infoDisplay.bind(this, 'txHash', receipt.tx)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.tx)}</td>
                        <td 
                            onMouseEnter={this.infoDisplay.bind(this, 'From', receipt.from)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.from)}</td>
                        <td 
                            onMouseEnter={this.infoDisplay.bind(this, 'To', receipt.to)}
                            onMouseLeave={this.infoClear.bind(this)}
                            width='10%'>{this.simplifyTxHash(receipt.to)}</td>
                        <td width='8%'>{this.getType(receipt)}</td>
                        <td width='8%'>{this.getAmount(receipt)}</td>
                        <td width='8%'>{receipt.gasUsed}</td>
                        <td width='8%'>{this.getGasPrice(receipt)}</td>
                        <td width='8%'>{receipt.blockNumber}</td>
                        {this.getStatusComponent(receipt)}
                    </tr>
                );
            })
        }
    }

    render() {

        return (
            <div className="ReceiptContainer">
                <table className="ReceiptMainTable">
                    <tbody>
                        <tr>
                            <th width='10%'>TxHash</th>
                            <th width='10%'>From</th>
                            <th width='10%'>To</th>
                            <th width='8%'>Type</th>
                            <th width='8%'>Amount</th>
                            <th width='8%'>Gas</th>
                            <th width='8%'>Gas Price</th>
                            <th width='8%'>Block No.</th>
                            <th width='8%'>Status</th>
                        </tr>
                        {this.receipts()}
                    </tbody>
                </table>
                <div className="ReceiptToolTipArea">
                    <input type='text' ref='infocache' value='' />
                </div>
            </div>
        )
    }


}

export default Receipts
