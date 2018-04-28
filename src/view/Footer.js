import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import castIronService from "../service/CastIronService";
import React from 'react';

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

    componentDidUnMount() {
        super.componentDidUnMount();
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

    handleClick(){
        CastIronActions.changeView("Receipts");
    }


    render = () => {

        let dashInfo = "BlockHeight: " + this.state.blockHeight + "  &nbsp Unix Time(Local Time) :" + this.state.unixTime + "(" +
            this.state.localTime + ") BlockTimeStamp: " + this.state.blockTime + " GasPrice: " +
            this.state.gasPrice;

        return (
            <table className="Footer" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
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
                        <th width='99%' style={{ textAlign: 'right', paddingTop: '0px', paddingBottom: '0px' }}><input type="button" className="button" 
                        onClick={this.handleClick} value="Receipts" /></th>
                    </tr>
                </tbody>
            </table>)
    }
}

export default Footer
