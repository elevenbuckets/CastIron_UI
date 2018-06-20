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
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser';
import BMartService from '../service/BMartService';

class Sell extends AlertModalUser {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.wallet = CastIronService.wallet;
	this.shopAddr = '0x';

        this.state = {
            estimateDeposit: null,
            sellOrder: null,
            price: 0,
            amount: 0,
	    shopDeposit: 0,
	    shopBalance: 0,
	    paidback: false,
	    canTakeSD: false,
	    totalTake: 0,
	    totalitems: 0
        }

	this.storeKeys = [ 'address', 'selected_token_name', 'accounts', 'alertContent', 'isAlertModalOpen' ];
        this.ETHMall = BMartService.ETHMall;
    }

    componentWillMount() {
        super.componentWillMount();

    }

    componentDidUpdate(prevProps, prevState) {
	this.shopAddr = this.ETHMall.getStoreInfo(this.state.address)[0];
	if (this.state.address !== prevState.address) {
		if (this.shopAddr == '0x') BlockTimer.unRegister(this.watchShopInfo); // unregister previous
		this.watchShopInfo();
        	this.getEstimateDeposit();
        	this.getShopAddrs();
	}
    }

    componentDidMount() {
        console.log("in componet did mount in Sell.js");
	this.shopAddr = this.ETHMall.getStoreInfo(this.state.address)[0];
	//this.getShopAddr();
	this.watchShopInfo();
        this.getEstimateDeposit();
        this.getShopAddrs();
        BlockTimer.register(this.getEstimateDeposit);
        BlockTimer.register(this.getShopAddrs);
	BlockTimer.register(this.watchShopInfo);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        BlockTimer.unRegister(this.getEstimateDeposit);
        BlockTimer.unRegister(this.getShopAddrs);
	BlockTimer.unRegister(this.watchShopInfo);
    }


    watchShopInfo = () => {
	    let shopAddr = this.ETHMall.getStoreInfo(this.state.address)[0];
	    // CastIron ABI + conditions loader
            BMartService.generateNewPoSIMSApp(this.state.address, shopAddr);
            let PoSIMS = BMartService.getPoSIMS(this.state.address);

	    // has store
	    if (typeof(PoSIMS) != 'undefined') {
	        let totalitems = Number(PoSIMS.totalitems().toString());

		if (totalitems > 0) { // has store; has order.
	    		let tokenAddr = this.wallet.TokenList[this.state.selected_token_name].addr;
	    		let orderInfo = PoSIMS.getCatalog()
	    		let orders = orderInfo.filter((c) => { return this.wallet.byte32ToAddress(c[1]) == tokenAddr; });
	    		let orderID = this.wallet.byte32ToDecimal(orders[0][0]);
            		let sellOrder = PoSIMS.getProductInfo(orderID);

            		this.setState({
                		sellOrder: {
                    		    amount: this.wallet.toEth(sellOrder[1], this.wallet.TokenList[this.state.selected_token_name].decimals).toFixed(6),
                    		    price: this.wallet.toEth(sellOrder[2], this.wallet.TokenList[Constants.ETH].decimals).toFixed(6)
                        	}
                	});
	    		this.getShopDeposit(shopAddr, PoSIMS);
	    	} else if (totalitems == 0) { // has store; no order.
            		this.setState({
                		sellOrder: {
                    		    amount: Number(0).toFixed(6),
                    		    price: Number(0).toFixed(6)
                        	}
                	});
	        	this.getShopDeposit(shopAddr, PoSIMS);
		}
	    } else { // closed store.
	    	// reset
	    	this.setState({
		    	sellOrder: null,
		    	shopDeposit: 0, 
	    	    	shopBalance: 0,
		    	canTakeSD: false,
		    	paidback: false,
		    	totalTake: 0,
		    	totalitems: 0
	    	});
	    }
    }

    getShopDeposit = (shopAddr, posims) => {
	    let p = posims.paid();
	    let d = Number(this.wallet.toEth(posims.deposit(), 18).toString());
	    let t = Number(this.wallet.toEth(this.wallet.web3.eth.getBalance(shopAddr), 18).toString());
	    let c = this.ETHMall.isExpired(shopAddr);
	    let e;
	    let s = posims.totalitems();

	    if (p === false) {
		    c === true ? e = t : e = t - d;
	    } else {
		    e = t;
	    }

	    this.setState({
		    shopDeposit: d, 
	    	    shopBalance: t,
		    canTakeSD: c,
		    paidback: p,
		    totalTake: e,
		    totalitems: Number(s.toString())
	    });
    }

    getShopAddrs = () => {

        let shopAddrs = Object.keys(this.state.accounts).map((addr) => {
            return this.ETHMall.getStoreInfo(addr)[0] == '0x' ? null : addr
        }).filter((value) => {
            return value !== null;
        })

        this.setState({ shopAddrs: shopAddrs });
        return shopAddrs;
    }

    getEstimateDeposit = () => {
        this.setState({
            estimateDeposit: CastIronService.wallet.toEth(this.ETHMall.getSecureDeposit(),
                CastIronService.wallet.TokenList[Constants.ETH].decimals).toFixed(6)
        });
    }

    handleChangeAmount = (event) => {

        let value = event.target.value;
		if(isNaN(value)){
			this.openModal("Please enter a number!")
			 event.target.value = value.slice(0, -1);
		}else{
            console.log('got event: ' + event.target.value);
            let amount = event.target.value;
            console.log('got amount: ' + amount);
            this.setState({ amount: amount });
		}	
      
    }

    handleChangePrice = (event) => {

        let value = event.target.value;
		if(isNaN(value)){
			this.openModal("Please enter a number!")
			 event.target.value = value.slice(0, -1);
		}else{
            console.log('got event: ' + event.target.value);
        let price = event.target.value;
        console.log('got price: ' + price);
        this.setState({ price: price });
		}	
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
                spender: this.shopAddr,
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
                id: 1
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
                price: this.wallet.toWei(this.state.price, this.wallet.TokenList[Constants.ETH].decimals).toString()
            }
        }
        CastIronActions.sendTk(tk);
    }

    withdraw = () => {
        let tk = {
            type: 'BMart',
            contract: "PoSIMS" + this.state.address,
            call: 'withdraw',
            args: [],
            txObj: { value: null, gas: 250000 },
            tkObj: {}
        }
        CastIronActions.sendTk(tk);
    }

    restock = () => {
        CastIronActions.send(this.state.address, this.shopAddr, this.state.selected_token_name, this.state.amount, 150000)
    }

    useOtherStore = (event) => {
        let stage = Promise.resolve(CastIronActions.addressUpdate(event.value, this.props.canvas))
        stage.then(() => {
            this.watchShopInfo();
        }

        );

    }


    render() {
        console.log("in Sell render()");
        return (

            <div style={{ width: '100%', overflow: 'scroll', margin: '0', maxHeight: "593px", height: '593px' }} >
                <table className="balance-sheet">
                    <tbody>
                        <tr className="bucket-table-init">
                            <td className="bucket-table-init"><SellShop createStore={this.createStore} disableCreateStore={this.shopAddr != "0x"}
                                estimateDeposit={this.state.estimateDeposit} shopAddrs={this.state.shopAddrs} sellOrder={this.state.sellOrder}
                                shopAddr={this.shopAddr} shopDeposit={this.state.shopDeposit} shopBalance={this.state.shopBalance}
                                address={this.state.address} useOtherStore={this.useOtherStore} paidback={this.state.paidback} totalOrders={this.state.totalitems}
				canTakeSD={this.state.canTakeSD} totalTake={this.state.totalTake} withdraw={this.withdraw} /></td>
                        </tr>
                        <tr className="bucket-table-init">
                            <td className="bucket-table-init"><SellOrder sellOrder={this.state.sellOrder} createOrder={this.createOrder}
			        totalOrders={this.state.totalitems}
                                disableCreateOrder={this.shopAddr == "0x" || this.state.sellOrder === null || this.state.totalitems != 0 }
                                disableChangePrice={this.shopAddr == "0x"}
                                disableRestock={this.shopAddr == "0x"}
                                disableCancelOrder={this.shopAddr == "0x"}
                                handleChangeAmount={this.handleChangeAmount}
                                handleChangePrice={this.handleChangePrice}
                                changePrice={this.changePrice}
                                restock={this.restock}
                                cancelOrder={this.cancelOrder}
                            /></td>
                        </tr>
                    </tbody>
                </table>
                <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>

            </div>
        )

    }
}

export default Sell
