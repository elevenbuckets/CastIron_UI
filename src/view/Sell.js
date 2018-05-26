import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import CastIronActions from '../action/CastIronActions';
import BlockTimer from '../util/BlockTimer';
import SellOrder from '../components/SellOrder';
import SellShop from '../components/SellShop';

class Sell extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;
        this.state = {
            buckets: [],
            showIndex: null,
            buyAmount: {}
        }


        // dApp specific info
        const __APP__ = 'BMart';


        // Expose internal binded contract instances.
        // This should not be necessary once CastIron provides constant functions observers.
        this.ETHMall = this.wallet.CUE[__APP__]['ETHMall'];
        this.Registry = this.wallet.CUE[__APP__]['Registry'];

    }

    createStore = () =>{
        
        let tk = {
            type: 'BMart',
            contract: 'ETHMall',
            call: 'NewStoreFront',
            args: [],
            txObj: { value: 3000000000000000000, gas: 2200000 },
            tkObj: {
            }
        }

        CastIronActions.sendTk(tk);
    }

    render() {
        console.log("in Sell render()");
        return (

            <div style={{ width: '100%', overflow: 'scroll', margin: '0', maxHeight: "578px", height: '578px' }} >
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <th className="balance-sheet" style={{ color: '#111111' }} width='816px'>Order</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='417px'>Shop</th>
                        </tr>
                        <tr>
                            <td ><SellOrder /></td>
                            <td ><SellShop createStore={this.createStore} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )

    }
}

export default Sell
