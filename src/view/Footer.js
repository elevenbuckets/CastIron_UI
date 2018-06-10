'use strict'
import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import castIronService from "../service/CastIronService";
import React from 'react';
import Constants from '../util/Constants';

// Reflux components

class Footer extends Reflux.Component {
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

        // let netStatus = this.wallet.ethNetStatus();
        // if (netStatus.blockHeight != this.state.blockHeight) {
        //     CastIronActions.infoUpdate(netStatus.blockHeight, netStatus.blockTime)
        // }
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
                    <td >
                        <input type="button" className="button" onClick={this.handleClick}
                            value={n > 0 ? "Receipts(" + n + ")" : "Receipts"} />
                    </td>
                    {n > 0 ? <td>
                        <div className="loader"></div>
                    </td> : null
                    }

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
        }
        return Constants.Pending;
    }

    handleClick() {
        CastIronActions.changeView("Receipts");
    }


    render = () => {

        let dashInfo = "BlockHeight: " + this.state.blockHeight + "  &nbsp Unix Time(Local Time) :" + this.state.unixTime + "(" +
            this.state.localTime + ") BlockTimeStamp: " + this.state.blockTime + " GasPrice: " +
            this.state.gasPrice;

        return (
            <table className="Footer" style={{ padding: '0px', margin: '0px', minWidth: '1280px', boxShadow: "rgb(10, 10, 10) 0px 26px 24px" }}>
                <tbody>
                    <tr style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                        <th style={{ paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' }}>
                            <dl style={{ paddingTop: '0px', paddingBottom: '0px' }}><dt>BlockHeight:</dt><dd>{this.state.blockHeight}</dd></dl>
                        </th>
                        <th style={{ paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' }}>
                            <dl style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                <dt>Unix Time:</dt><dd>{this.state.unixTime}</dd>
                            </dl>
                        </th>
                        <th style={{ paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' }}>
                            <dl style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                <dt>Local Time:</dt><dd>{String(this.state.localTime)}</dd>
                            </dl>
                        </th>
                        <th style={{ paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' }}>
                            <dl style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                <dt>BlockTimeStamp:</dt><dd>{this.state.blockTime}</dd>
                            </dl>
                        </th>
                        <th style={{ paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' }}>
                            <dl style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                                <dt>GasPrice:</dt><dd>{this.state.gasPrice}</dd>
                            </dl>
                        </th>
                        <th style={{ paddingTop: '0px', paddingBottom: '0px', whiteSpace: 'nowrap' }}>
                            <input type="button" className="dbutton" onClick={this.props.handleDrawer} value="Drawer" style={{ border: "0px", color: "white" }} />
                        </th>
                        <th width='99%' style={{ textAlign: 'right', paddingTop: '0px', paddingBottom: '0px' }}>
                            {this.getReceiptComponent()}
                        </th>
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default Footer
