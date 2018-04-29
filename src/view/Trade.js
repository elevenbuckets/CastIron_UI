import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import CastIronActions from '../action/CastIronActions';
import TxObjects from './TxObjects';
import TxQList from './TxQList';

class Trade extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.state = {
            orders: [{ price: 1.5, amount: 2000 }, { price: 1.6, amount: 3000 }, { price: 1.8, amount: 20000 }]
        }
        this.wallet = CastIronService.wallet;
    }

    buy = () => {

    }

    sell = () => {
        //TODO: implement this 
    }

    orders = () => {
        if (this.state.orders) {
            return this.state.orders.map((order) => {
                return (
                    <tr className="balance-sheet">
                        <td className="balance-sheet" width='20%'>{order.price}</td>
                        <td className="balance-sheet" width='20%'>{order.amount}</td>
                        <td className="balance-sheet" width='40%'><input type="button" className="button" value='Buy'
                            onClick={this.buy} /></td>

                    </tr>
                );
            })
        }
    }

    render() {
        console.log("in Trade render()");
        return (
            <div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="avatar" style={{ textAlign: "center" }}>
                            <th colSpan="2" className="avatar" style={{ textAlign: "center" }}>Trade</th>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet" width="17%">Trading Pair</td>
                            <td className="balance-sheet">
                                {"ETH - " + this.state.selected_token_name}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ overflow: 'scroll', margin: '0', maxHeight: "490px", height: '490px' }} >
                    <table className="balance-sheet">
                        <tbody>
                            <tr className="balance-sheet">
                                <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Price</th>
                                <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Amount</th>
                                <th className="balance-sheet" style={{ color: '#111111' }} width='40%'>Action</th>
                                <td className="balance-sheet" width='20%' rowSpan='4' style={{ backgroundColor: '#eeeeee' }}>
                                    <input type="button" className="button" value='Sell'
                                        onClick={this.sell} />
                                </td>
                            </tr>
                            {this.orders()}
                        </tbody>
                    </table>
                </div>
            </div>

        )

    }
}

export default Trade