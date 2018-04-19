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
        this.getDashInfo();
    }

    componentDidMount() {
        this.timer = setInterval(this.getDashInfo, 1000);
    }

    componentDidUnMount() {
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

        let dashInfo = "BlockHeight: " + this.state.blockHeight + " Unix Time(Local Time) :" + this.state.unixTime + "(" +
            this.state.localTime + ") BlockTimeStamp: " + this.state.blockTime + " GasPrice: " +
            this.state.gasPrice;

        return <p>{dashInfo}</p>
        // if (this.state.address == '') return (<p />);

        // const balanceSheet = Object.keys(this.state.balances).map((b) => {
        //     if (b == 'ETH') {
        //         return (
        //             <tr key={b} className="balance-sheet">
        //                 <td className="balance-sheet" width='185'>{b}:</td>
        //                 <td className="balance-sheet">{this.state.balances[b]}</td>
        //                 <td className="balance-sheet"><input type="button" className="button" value="send" /></td>
        //                 <td className="balance-sheet"><input type="button" className="button" value="buy" disabled /></td>
        //                 <td className="balance-sheet"><input type="button" className="button" value="sell" disabled /></td>
        //             </tr>);
        //     } else {
        //         return (
        //             <tr key={b} className="balance-sheet">
        //                 <td className="balance-sheet" width='185'>{b}:</td>
        //                 <td className="balance-sheet">{this.state.balances[b]}</td>
        //                 <td className="balance-sheet"><input type="button" className="button" value="send" /></td>
        //                 <td className="balance-sheet"><input type="button" className="button" value="buy" /></td>
        //                 <td className="balance-sheet"><input type="button" className="button" value="sell" /></td>
        //             </tr>);
        //     }
        // });

        // return (
        //     <table className="balance-sheet">
        //         <tbody>
        //             <tr>
        //                 <th className="balance-sheet">Types</th>
        //                 <th className="balance-sheet">Amount</th>
        //                 <th className="balance-sheet" colSpan="3">Actions</th>
        //             </tr>
        //             {balanceSheet}
        //         </tbody>
        //     </table>);
    }
}

export default Footer