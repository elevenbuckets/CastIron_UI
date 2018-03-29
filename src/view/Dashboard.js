import React, { Component } from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);


        this.state = {
            blockHeight: 120000,
            unixTime: 123213,
            localTime: null,
            blockTimeStamp: null,
            gasPrice: 20

        }

        this._onSelect = this._onSelect.bind(this);
    }

    _onSelect(value) {
        this.setState((preState) => {
            let state = preState;
            state.selected_account = JSON.parse(value.value);
            return state;
        })

    }

    render() {
        let dashInfo = "BlockHeight: " + this.state.blockHeight + " Unix Time(Local Time) :" + this.state.unixTime + "(" +
                        this.state.localTime + ") BlockTimeStamp: " + this.state.blockTimeStamp + " GasPrice: " + 
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

