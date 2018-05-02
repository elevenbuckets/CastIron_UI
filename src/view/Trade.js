import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import CastIronActions from '../action/CastIronActions';
import BlockTimer from '../util/BlockTimer';
import { BADNAME } from "dns";

class Trade extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;
        this.state = {
            buckets: [],
            showBuckets: null
        }


        // dApp specific info
        const __APP__ = 'BMart';


        // Expose internal binded contract instances.
        // This should not be necessary once CastIron provides constant functions observers.
        this.ETHMall = this.wallet.CUE[__APP__]['ETHMall'];
        this.Registry = this.wallet.CUE[__APP__]['Registry'];

    }

    componentWillMount() {
        super.componentWillMount();

    }

    componentDidMount() {
        this.setState({orders : this.readOrders()});
        console.log("in componet did mount in Trade.js");
        BlockTimer.register(this.refreshOrders);
    }

    componentDidUnMount() {
        super.componentDidUnMount();
        BlockTimer.unRegister(this.refreshOrders);
    }

    buy = (order) => {
    
        let posAddr = order.addr;
        let price = this.wallet.toWei(order.price, this.wallet.TokenList["ETH"].decimals);
        let buyAmount = 10;
        let payment = price.times(buyAmount); // 10 tokens
        let total = payment.times(1.0025);
        let tokenAddr = this.wallet.TokenList[this.state.selected_token_name].addr;
        let buyAmountInUnit = this.wallet.toWei(buyAmount, this.wallet.TokenList[this.state.selected_token_name].decimals).toString();

        let tk = {
            type: 'BMart',
            contract : 'ETHMall',
            call : 'buyProxy',
            args:  ['posims', 'token', 'amount'],
            txObj : {value :total.toString(), gas:2200000  },
            tkObj : {
                posims: posAddr, 
                token: tokenAddr,
                amount: buyAmountInUnit
            }
        }

        CastIronActions.sendTk(tk);
        


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

    showBuckets = (bucket) => {
        if (bucket.index == this.state.showIndex) {
            let res = [];
            res.push(<tr className="balance-sheet">
                <td className="balance-sheet" width='20%' >{bucket.price}</td>
                <td className="balance-sheet" width='20%' >{bucket.amount}</td>
                <td className="balance-sheet" width='40%' > <input type="button" className="button" value='Hide Stores'
                    onClick={this.hide.bind(this, bucket.index)} />
                </td>

            </tr>)
            let res2 = this.state.orders.slice(bucket.start, bucket.end + 1).map((order) => {
                return (
                    <tr className="balance-sheet">
                        <td className="balance-sheet" width='20%' >{order.price}</td>
                        <td className="balance-sheet" width='20%' >{order.amount}</td>
                        <td className="balance-sheet" width='40%' ><input type="button" className="button" value='Buy'
                            onClick={this.buy.bind(this, order)} /></td>

                    </tr>
                );
            })

            return res.concat(res2);
        }

    }

    readOrders = () => {
        let TKRAddr = this.wallet.TokenList[this.state.selected_token_name].addr;
        let TKRdecimal = this.wallet.TokenList[this.state.selected_token_name].decimals;
        return this.Registry.browseStock(TKRAddr, 1, 100).map((rawOrder) => {
            return {
                addr: this.wallet.byte32ToAddress(rawOrder[0]),
                amount: Number(this.wallet.toEth(rawOrder[1], this.wallet.TokenList[this.state.selected_token_name].decimals).toFixed(9)),
                price: Number(this.wallet.toEth(rawOrder[2], this.wallet.TokenList["ETH"].decimals).toFixed(9))
            }

        })
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

    refreshOrders = () => {
        this.setState({
            orders: this.readOrders()
        })

    }

   

    orders = () => {

        if (this.state.orders) {
            this.sortOrders();
            return this.state.buckets.map((bucket) => {
                return (
                    bucket.index == this.state.showIndex ? this.showBuckets(bucket) :
                        <tr className="balance-sheet">
                            <td className="balance-sheet" width='20%' >{bucket.price}</td>
                            <td className="balance-sheet" width='20%' >{bucket.amount}</td>
                            <td className="balance-sheet" width='40%' >
                                <input type="button" className="button" value='Show Stores'
                                    onClick={this.show.bind(this, bucket.index)} />

                            </td>

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