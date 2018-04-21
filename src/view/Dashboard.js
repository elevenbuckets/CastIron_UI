import React, { Component } from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';
import CastIronService from '../service/CastIronService';
import CastIronStore from '../store/CastIronStore';
import WalletView from './WalletView';
import ReceiptsView from './ReceiptsView';
import QueryForm from './QueryForm'
import Footer from './Footer'
import Transfer from './Transfer'

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);
	this.store = CastIronStore;
    }

    render() {

        return (
            <div>
                <QueryForm />
                <Transfer />
                <Footer />
            </div>

        )
    }

}


export default DashBoard

