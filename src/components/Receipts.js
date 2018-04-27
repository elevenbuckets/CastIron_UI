import React, { Component } from 'react';
import Reflux from 'reflux';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';
import Receipt from './Receipt';
import Constants from '../util/Constants'


class Receipts extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    simplifyTxHash = (content) =>{
        let res = content.substring(0,5);
        res = res + "...";
        let length = content.length;
        res = res + content.substring(length-5, length);
        return res;
    }

    getType(receipt){
        if(Constants.Token === receipt.type || Constants.Web3 === receipt.type){
            return receipt.contract;
        }
        return "Function"
    }

    getAmount(receipt){
        if(Constants.Web3 === receipt.type && Constants.ETH === receipt.contract){
            return CastIronService.wallet.toEth(CastIronService.wallet.hex2num(receipt.value),
             CastIronService.wallet.TokenList[Constants.ETH].decimals).toFixed(9);
        }else if(Constants.Token === receipt.type){
            return CastIronService.wallet.toEth(CastIronService.wallet.hex2num(receipt.amount),
            CastIronService.wallet.TokenList[receipt.contract].decimals).toFixed(9);
        }
        return receipt.amount;
    }

    getStatus(receipt){
        if(receipt.status === "0x0"){
            return Constants.Failed;
        }else if(receipt.status === "0x1"){
            return Constants.Succeeded;
        }
        return Constants.Pending;
    }


    receipts = () =>{
        if(this.props.receipts){
            return this.props.receipts.map((receipt) => {
                return (
                  <tr>
                  <td className="txform" width='36%'>{this.simplifyTxHash(receipt.tx)}</td>
                  <td className="txform" width='20%'>{receipt.from}</td>
                  <td className="txform" width='20%'>{receipt.to}</td>
                  <td className="txform" width='4%'>{this.getType(receipt)}</td>
                  <td className="txform" width='5%'>{this.getAmount(receipt)}</td>
                  <td className="txform" width='5'>{receipt.gasUsed}</td>
                  <td className="txform" width='5%'>{receipt.blockNumber}</td>
                  <td className="txform">{this.getStatus(receipt)}</td>
                  </tr>
                );
              })
        }
    }

    render() {
        
        return (
            <div style={{ overflow: 'scroll', margin: '0', maxHeight: "430", height: '430px' }} >
            <table className="txform">
              <tbody>
                <tr>
                  <td className="txform" width='36%'>TxHash</td>
                  <td className="txform" width='20%'>From</td>
                  <td className="txform" width='20%'>To</td>
                  <td className="txform" width='4%'>Type</td>
                  <td className="txform" width='5%'>Amount</td>
                  <td className="txform" width='5'>Gas Fee</td>
                  <td className="txform" width='5%'>Block Number</td>
                  <td className="txform">Status</td>
                </tr>
                {this.receipts()}
              </tbody>
            </table>
          </div>
        )
    }


}

export default Receipts