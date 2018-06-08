import React, { Component } from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router-dom';
import CastIronService from '../service/CastIronService';
import CastIronStore from '../store/CastIronStore';
import WalletView from './WalletView';
import ReceiptsView from './ReceiptsView';
import QueryForm from './QueryForm'
import Footer from './Footer';
import Drawer from './Drawer';
import Transfer from './Transfer'
import Trade from './Trade';
import Modal from 'react-modal';
import ConfirmTXModal from '../components/ConfirmTXModal';
import CastIronActions from '../action/CastIronActions';
import AlertModal from '../components/AlertModal'

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
	this.state = {
		drawerOut: false
	}
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

    handleClick = (event) => {
	this.setState({drawerOut: !this.state.drawerOut});
	event.target.blur();
	event.stopPropagation();
    }


    render() {

        return (
            <div id="dashboard" className={this.state.drawerOut ? 'raise' : 'close'}>
	       <div>
                <QueryForm ref="queryForm" />
                {this.state.currentView == "Transfer" ? <Transfer /> : this.state.currentView == "Receipts" ? <ReceiptsView /> 
                : <Trade canvas={this.refs.queryForm.refs.canvas}/>}

                <AlertModal content={"Please unlock with your master passward!"} 
                isAlertModalOpen={this.state.modalIsOpen && (!this.state.unlocked) } close={this.cancelTX} />
                <Modal isOpen={this.state.modalIsOpen && this.state.unlocked} style=
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
                <ConfirmTXModal confirmTX={this.confirmTX} cancelTX={this.cancelTX}  />
                </Modal>
                <Footer handleDrawer={this.handleClick} draw={this.state.drawerOut}/>
	       </div>
                <Drawer refs="underlayer" handleClick={this.handleClick} draw={this.state.drawerOut}/>
	  </div>
        )
    }

}


export default DashBoard

