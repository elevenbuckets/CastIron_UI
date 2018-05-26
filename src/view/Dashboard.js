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
import Trade from './Trade';
import Modal from 'react-modal';
import ConfirmTXModal from '../components/ComfirmTXModal';
import CastIronActions from '../action/CastIronActions'

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.map = {
            Transfer: <Transfer />,
            Receipts: <ReceiptsView />,
            Trade: <Trade />
        }
    }

    confirmTX = () =>{
        CastIronActions.confirmTx();
    }

    cancelTX = () =>{
        CastIronActions.cancelTx();
    }


    render() {

        return (
            <div>
                <QueryForm />
                {this.map[this.state.currentView]}
                <Modal isOpen={this.state.modalIsOpen}> This is modal!
                <ConfirmTXModal confirmTX={this.confirmTX}/>
                </Modal>
                <Footer />
            </div>

        )
    }

}


export default DashBoard

