import React, { Component } from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';
import CastIronService from '../service/CastIronService';

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);

        this.wallet = CastIronService.wallet;

        this.state = {
            blockHeight: 120000,
            unixTime: 123213,
            localTime: null,
            blockTime: null,
            gasPrice: 15,
            defaultGasPrice: 20

        }

        this.getDashInfo = this.getDashInfo.bind(this);
    }

    componentWillMount(){
       this.getDashInfo();
    }

    componentDidMount(){
        this.timer = setInterval(this.getDashInfo, 1000);
    }

    componentDidUnMount(){
        clearInterval(this.timer);
    }


    getDashInfo(){
        this.setState((preState) => {
            let state = preState;
            let netStatus = this.wallet.ethNetStatus();
            state.blockHeight = netStatus.blockHeight;
            state.blockTime = netStatus.blockTime;
            state.localTime = new Date();
            state.unixTime = Date.now();
            this.wallet.gasPriceEst().then(data =>{
                state.gasPrice = this.wallet.toEth(data.fast, 9).toString()
            }
            , error =>{state.gasPrice = preState.defaultGasPrice });
            return state;
        })
    }


    render() {
        let dashInfo = "BlockHeight: " + this.state.blockHeight + " Unix Time(Local Time) :" + this.state.unixTime + "(" +
                        this.state.localTime + ") BlockTimeStamp: " + this.state.blockTime + " GasPrice: " + 
                        this.state.gasPrice;
        return (
            <div>
                <h1>This is the DashBoard view!</h1>
                <p>{dashInfo}</p>
                <Link to="/"> Wallet View </Link>
                <Link to="/receipts"> Receipts View </Link>
            </div>

        )
    }

}


export default DashBoard

