import React, { Component } from 'react';
import Reflux from 'reflux';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';
import Receipt from './Receipt';


class Receipts extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    simplifyContent = (content) =>{
        let res = content.substring(0,5);
        res = res + "...";
        let length = content.length;
        res = res + content.substring(length-5, length);
        return res;
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
                {this.props.receipts.map((receipt) => {
                  return (
                    <tr>
                    <td className="txform" width='36%'>{this.simplifyContent(receipt.transactionHash)}</td>
                    <td className="txform" width='20%'>{receipt.from}</td>
                    <td className="txform" width='20%'>{receipt.to}</td>
                    <td className="txform" width='4%'>{receipt.type}</td>
                    <td className="txform" width='5%'>{receipt.amount}</td>
                    <td className="txform" width='5'>{receipt.gasUsed}</td>
                    <td className="txform" width='5%'>{receipt.blockNumber}</td>
                    <td className="txform">Status</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
    }


}

export default Receipts