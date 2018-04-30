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
            // orders: [{ price: 1.5, amount: 2000 }, { price: 1.6, amount: 3000 }, { price: 1.8, amount: 20000 }]
            orders: this.mockOrders(),
            buckets: [],
            showBuckets: null
        }
        this.wallet = CastIronService.wallet;
    }

    buy = () => {

    }

    sell = () => {
        //TODO: implement this 
    }

    show = (index) => {
        this.setState({ showIndex: index });
    }

    hide = (index) => {
        this.setState({ showIndex: null });
    }

    showBuckets = (index, start, end) => {
        if (index == this.state.showIndex) {
            return this.state.orders.slice(start, end + 1).map((order) => {
                return (
                    <tr className="balance-sheet">
                        <td className="balance-sheet" width='20%' >{order.price}</td>
                        <td className="balance-sheet" width='20%' >{order.amount}</td>
                        <td className="balance-sheet" width='40%' ><input type="button" className="button" value='Buy'
                            onClick={this.buy} /></td>

                    </tr>
                );
            })
        }

    }

    readOrders = () => {

    }

    sortOrders() {
        this.state.orders.sort((a, b) => {
            return a.price > b.price ? 1 : -1;
        })

        let arr = Array.from(Array(11).keys());
        let orders = this.state.orders;
        let a = Math.floor(orders.length / 11);
        let b = orders.length % 11;

        this.state.buckets = arr.map((i) => {
            let start, end;
            if (i < b) {
                start = i * (a + 1);
                end = start + a;
            } else {
                start = i * (a + 1) - (i - b);
                end = start + a - 1;
            }
            let amount = orders.slice(start, end + 1).map((o) => o.amount).reduce((a, b) => {
                return a + b;
            })
            return { price: orders[start].price + "--" + orders[end].price, amount: amount, start, end, index: i }
        })

    }
    mockOrders = () => {
        let array = [];
        for (var i = 1; i < 100; ++i) {
            let item = {
                price: (Math.random() * 10).toFixed(6),
                amount: i
            }

            array.push(item);

        }

        return array;
    }

    orders = () => {
        this.sortOrders();
        if (this.state.orders) {
            return this.state.buckets.map((bucket) => {
                return (
                    <tr className="balance-sheet">
                        <td className="balance-sheet" width='20%' >{bucket.price}</td>
                        <td className="balance-sheet" width='20%' >{bucket.amount}</td>
                        <td className="balance-sheet" width='40%' >
                            {bucket.index == this.state.showIndex ? <div>
                                 {this.showBuckets(bucket.index, bucket.start, bucket.end)}
                                 <input type="button" className="button" value='Hide Stores'
                                    onClick={this.hide.bind(this, bucket.index)} />
                                  </div> :
                                <input type="button" className="button" value='Show Stores'
                                    onClick={this.show.bind(this, bucket.index)} />

                            }</td>

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
                                <td className="balance-sheet" width='20%' rowSpan='12' style={{ backgroundColor: '#eeeeee' }}>
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