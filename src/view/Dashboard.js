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
        // this.map = {
        //     Transfer: <Transfer />,
        //     Receipts: <ReceiptsView />,
        //     Trade: <Trade />
        // }
       
    }

    confirmTX = () => {
        CastIronActions.confirmTx();
    }

    cancelTX = () => {
        CastIronActions.cancelTx();
    }


    render() {

        return (
            <div>
                <QueryForm ref="queryForm" />
                {this.state.currentView == "Transfer" ? <Transfer /> : this.state.currentView == "Receipts" ? <ReceiptsView /> 
                : <Trade canvas={this.refs.queryForm.refs.canvas}/>}
                <Modal isOpen={this.state.modalIsOpen} style=
                    {
                        {
                            overlay: {
                                width: '100%',
                                maxHeight: '100%',
                                zIndex: '5'
                            },
                            content: {
                                top: '400px',
                                left: '400px',
                                right: '400px',
                                bottom: '400px'

                            }
                        }
                    }> Please confirm!
                <ConfirmTXModal confirmTX={this.confirmTX} cancelTX={this.cancelTX} />
                </Modal>
                <Footer />
            </div>

        )
    }

}


export default DashBoard

