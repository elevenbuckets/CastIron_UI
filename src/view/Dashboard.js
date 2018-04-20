import React, { Component } from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';
import CastIronService from '../service/CastIronService';
import WalletView from './WalletView';
import ReceiptsView from './ReceiptsView';
import QueryForm from './QueryForm'
import Footer from './Footer'

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);
    }




    render() {

        return (
            <div>
                <QueryForm />
                <WalletView />
                <Footer/ >
            </div>

        )
    }

}


export default DashBoard

