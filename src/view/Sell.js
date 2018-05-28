import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import CastIronActions from '../action/CastIronActions';
import Constants from '../util/Constants'
import BlockTimer from '../util/BlockTimer';
import SellOrder from '../components/SellOrder';
import SellShop from '../components/SellShop';
import path from 'path';

class Sell extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;
        this.state = {
            shopAddr: '0x',
            estimateDeposit: null,
            sellOrder: null,
            price: 0,
            amount: 0

        }



        const __pkgdir = path.join('dapps', 'BMart');
        const __abidir = path.join(__pkgdir, 'ABI');
        const __condir = path.join(__pkgdir, 'conditions');

        const abiPath = ctrName => { return path.join(__abidir, ctrName + '.json'); }
        const condPath = (ctrName, condName) => { return path.join(__condir, ctrName, condName + '.json') };
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
        console.log("in componet did mount in Sell.js");
        this.getEstimateDeposit();
        this.getSellOrder();
        this.getShopAddrs();
        BlockTimer.register(this.getEstimateDeposit);
        BlockTimer.register(this.getShopAddrs);
        BlockTimer.register(this.getSellOrder);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        BlockTimer.unRegister(this.getEstimateDeposit);
        BlockTimer.unRegister(this.getSellOrder);
        BlockTimer.unRegister(this.getShopAddrs);
    }


    getShopAddr = () => {
        let shopAddr = this.ETHMall.getStoreInfo(this.state.address)[0];
        if (shopAddr != this.state.shopAddr) {
            this.setState({ shopAddr: shopAddr });

            // dApp specific info
            const __APP__ = 'BMart';

            const __pkgdir = path.join('dapps', 'BMart');
            const __abidir = path.join(__pkgdir, 'ABI');
            const __condir = path.join(__pkgdir, 'conditions');

            const abiPath = ctrName => { return path.join(__abidir, ctrName + '.json'); }
            const condPath = (ctrName, condName) => { return path.join(__condir, ctrName, condName + '.json') };

            // CastIron ABI + conditions loader
            this.wallet.newApp(__APP__)('0.2', 'PoSIMS' + this.state.address, abiPath('PoSIMS'), { 'Sanity': condPath('PoSIMS', 'Sanity') }, shopAddr);
            this.PoSIMS = this.wallet.CUE[__APP__]['PoSIMS' + this.state.address];
        }

        return shopAddr;
    }

    getShopAddrs = () => {

        let shopAddrs = Object.keys(this.state.accounts).map((addr) =>{
            return     this.ETHMall.getStoreInfo(addr)[0] == '0x'? null : addr 
            

        }).filter((value) =>{
            return value !== null;
        })
       
        this.setState({shopAddrs : shopAddrs});
        return shopAddrs;
    }


    getSellOrder = () => {
        //TODO : udpate this
        console.log("sell Order : " + this.state.sellOrder);
        if (this.getShopAddr()!= "0x") {
            let sellOrder = this.PoSIMS.getProductInfo(1);
            if(sellOrder){
                this.setState({ sellOrder: {
                    amount : this.wallet.toEth(sellOrder[1], this.wallet.TokenList[this.state.selected_token_name].decimals).toFixed(6),
                    price : this.wallet.toEth(sellOrder[2], this.wallet.TokenList[Constants.ETH].decimals).toFixed(6)
                } });
            }
           
        }
    }

    getEstimateDeposit = () => {
        this.setState({
            estimateDeposit: CastIronService.wallet.toEth(this.ETHMall.getSecureDeposit(),
                CastIronService.wallet.TokenList[Constants.ETH].decimals).toFixed(6)
        });
    }

    handleChangeAmount = (event) => {
        console.log('got event: ' + event.target.value);
        let amount = event.target.value;
        console.log('got amount: ' + amount);
        this.setState({ amount: amount });
    }

    handleChangePrice = (event) => {
        console.log('got event: ' + event.target.value);
        let price = event.target.value;
        console.log('got price: ' + price);
        this.setState({ price: price });
    }


    createStore = () => {

        let tk = {
            type: 'BMart',
            contract: 'ETHMall',
            call: 'NewStoreFront',
            args: [],
            txObj: { value: this.ETHMall.getSecureDeposit(), gas: 2200000 },
            tkObj: {
            }
        }

        CastIronActions.sendTk(tk);
    }

    createOrder = () => {

        let tk1 = {
            type: 'Token',
            contract: this.state.selected_token_name,
            call: 'approve',
            args: ['spender', 'amount'],
            txObj: { value: null, gas: 250000 },
            tkObj: {
                spender: this.state.shopAddr,
                amount: this.wallet.toWei(this.state.amount, this.wallet.TokenList[this.state.selected_token_name].decimals).toString()
            }
        }

        let tk2 = {
            type: 'BMart',
            contract: "PoSIMS" + this.state.address,
            call: 'addProductInfo',
            args: ['token', 'amount', 'price'],
            txObj: { value: null, gas: 250000 },
            tkObj: {
                token: this.wallet.TokenList[this.state.selected_token_name].addr,
                amount: this.wallet.toWei(this.state.amount, this.wallet.TokenList[this.state.selected_token_name].decimals).toString(),
                price: this.wallet.toWei(this.state.price, this.wallet.TokenList[Constants.ETH].decimals).toString()
            }
        }


        CastIronActions.sendTks([tk1, tk2]);
    }

    cancelOrder = () => {
        let tk = {
            type: 'BMart',
            contract: "PoSIMS" + this.state.address,
            call: 'delistProduct',
            args: ['id'],
            txObj: { value: null, gas: 250000 },
            tkObj: {
                id : 1
            }
        }
        CastIronActions.sendTk(tk);
    }

    changePrice = () => {
        let tk = {
            type: 'BMart',
            contract: "PoSIMS" + this.state.address,
            call: 'changePrice',
            args: ['token', 'price'],
            txObj: { value: null, gas: 250000 },
            tkObj: {
                token: this.wallet.TokenList[this.state.selected_token_name].addr,
                price:this.wallet.toWei(this.state.price, this.wallet.TokenList[Constants.ETH].decimals).toString()
            }
        }
        CastIronActions.sendTk(tk);
    }

    restock = () => {
        CastIronActions.send(this.state.shopAddr, this.state.selected_token_name, this.state.amount, 150000)
    }

    useOtherStore = (event) => {
        CastIronActions.addressUpdate(event.value, this.props.canvas)
    }


    render() {
        console.log("in Sell render()");
        return (

            <div style={{ width: '100%', overflow: 'scroll', margin: '0', maxHeight: "578px", height: '578px' }} >
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <th className="balance-sheet" style={{ color: '#111111' }} width='686px'>Order</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='617px'>Shop</th>
                        </tr>
                        <tr>
                            <td ><SellOrder sellOrder={this.state.sellOrder} createOrder={this.createOrder}
                                disableCreateOrder={this.state.shopAddr == "0x"}
                                disableChangePrice={this.state.shopAddr == "0x"}
                                disableRestock={this.state.shopAddr == "0x"}
                                disableCancelOrder={this.state.shopAddr == "0x"}
                                handleChangeAmount={this.handleChangeAmount}
                                handleChangePrice={this.handleChangePrice}
                                changePrice={this.changePrice}
                                restock={this.restock}
                                cancelOrder={this.cancelOrder}
                            /></td>
                            <td ><SellShop createStore={this.createStore} disableCreateStore={this.state.shopAddr != "0x"}
                                estimateDeposit={this.state.estimateDeposit} shopAddrs={this.state.shopAddrs} 
                                address={this.state.address} useOtherStore={this.useOtherStore}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )

    }
}

export default Sell
