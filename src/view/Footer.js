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
            return { localTime: new Date(), unixTime: Date.now() };
        })

        let netStatus = this.wallet.ethNetStatus();
        if (netStatus.blockHeight != this.state.blockHeight) {
            CastIronActions.infoUpdate(netStatus.blockHeight, netStatus.blockTime)
        }
    }


    render = () => {

        let dashInfo = "BlockHeight: " + this.state.blockHeight + "  &nbsp Unix Time(Local Time) :" + this.state.unixTime + "(" +
            this.state.localTime + ") BlockTimeStamp: " + this.state.blockTime + " GasPrice: " +
            this.state.gasPrice;

        return (<footer>
            <table className="balance-sheet">
                 <tbody>
                     <tr>
                         <th className="balance-sheet">{"BlockHeight: " + this.state.blockHeight}</th>
                         <th className="balance-sheet">{"Unix Time(Local Time) :" + this.state.unixTime + "(" +
                         this.state.localTime + ")"}</th>
                         <th className="balance-sheet">{"BlockTimeStamp: " + this.state.blockTime}</th>
                         <th className="balance-sheet">{"GasPrice: " +
                         this.state.gasPrice}</th>
                         <th className="balance-sheet" colSpan="3"><input type="button" className="button" value="Receipts" disabled /></th>
                     </tr>
                 </tbody>
             </table>);
        </footer>)
        
    }
}

export default Footer