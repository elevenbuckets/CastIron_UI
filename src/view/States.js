'use strict';

// Third-parties
import Reflux from 'reflux';
import React from 'react';

// Reflux store
import CastIronStore from "../store/CastIronStore";

// Reflux action
import CastIronActions from '../action/CastIronActions'

// Singleton service
import castIronService from "../service/CastIronService";

// constants utilities
import Constants from '../util/Constants';

class States extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.wallet = castIronService.wallet;

        this.state = {
            unixTime: 123213,
            localTime: null,
            defaultGasPrice: 20
        }

        this.getDashInfo = this.getDashInfo.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        this.getDashInfo();
    }

    componentDidMount() {
        this.timer = setInterval(this.getDashInfo, 1000);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        clearInterval(this.timer);
    }

    getDashInfo() {
        this.setState(() => {
            return { localTime: new Date(), unixTime: Date.now() / 1000 };
        })
    }

    hasNumberOfPendingReceipts = () => {
        let pendingQs = Object.keys(this.state.receipts).filter(Q => {
            return this.state.receipts[Q] && this.state.receipts[Q].length > 0 && this.hasPendingReceipt(this.state.receipts[Q])
        })

        return pendingQs.length;
    }

    getReceiptComponent = () => {
        let n = this.hasNumberOfPendingReceipts();
        return <table>
            <tbody>
                <tr>
		    <td style={{border: '0px', width: '480px'}}>
                    		{ 
				  n > 0 
			   		? <div align="right" className="loader"></div> 
			   		: <div></div> 
		    		}
		    </td>
                    <td style={{border: '0px'}}>
                        <input type="button" className="button" value={n > 0 ? "Receipts(" + n + ")" : "Receipts"} onClick={this.handleClick} />
                    </td>
                </tr>
            </tbody>
        </table>
    }

    hasPendingReceipt = (receipts) => {
        for (let i in receipts) {
            if (this.getStatus(receipts[i]) == Constants.Pending) {
                return true;
            }
        }
        return false;
    }

    getStatus(receipt) {
        if (receipt.status === "0x0") {
            return Constants.Failed;
        } else if (receipt.status === "0x1") {
            return Constants.Succeeded;
        }else if(receipt.error){
            return Constants.Errored;
        }
        return Constants.Pending;
    }

    handleClick() {
        CastIronActions.changeView("Receipts");
    }

    render = () => {
        return (
            <div className="item state">
                <div className="item tblockheight"><p>Block Height</p></div>
                <div className="item tblockstamp"><p>Block Stamp</p></div>
                <div className="item tlocaltime"><p>Local Time</p></div>
                <div className="item tgasprice"><p>Gas Price</p></div>
                <div className="item blockheight"><div id="cbh" >{this.state.blockHeight}</div></div>
                <div className="item blockstamp"><div id="cbs">{this.state.blockTime}</div></div>
                <div className="item localtime"><div id="clt">{String(this.state.localTime).substring(0,24)}</div></div>
                <div className="item gasprice"><div id="cgp">{this.state.gasPrice}</div></div>
            </div>
        )
    }
}

export default States;