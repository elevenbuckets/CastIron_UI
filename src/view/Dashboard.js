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
import AlertModal from '../components/AlertModal';
import ScheduleTXModal from '../components/ScheduleTXModal';
import DappViewService from '../service/DappViewService'

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.state = {
            drawerOut: false
        }
	this.storeKeys = [ "unlocked", "currentView", "modalIsOpen", "scheduleModalIsOpen", "accounts", 'balances' ];

    }

    confirmTX = () => {
        CastIronActions.confirmTx();
    }

    cancelTX = () => {
        CastIronActions.cancelTx();
    }

    confirmScheduleTX = (queue) => {
        CastIronActions.confirmScheduleTx(queue);
    }

    cancelScheduleTX = () => {
        CastIronActions.cancelScheduleTx();
    }

    handleClick = (event) => {
        this.setState({ drawerOut: !this.state.drawerOut });
        event.target.blur();
        event.stopPropagation();
    }

    render() {
        console.log("in Dashboard render()")
        return (
            <div id="dashboard" className={this.state.drawerOut ? 'raise' : 'close'}>
                <div>
                    <QueryForm ref="queryForm" />
                    {this.state.currentView == "Transfer" ? <Transfer /> : this.state.currentView == "Receipts" ? <ReceiptsView />
                        : this.state.currentView == "Trade"? <Trade canvas={this.refs.queryForm.refs.canvas}/> : 
                        DappViewService.getView(this.state.currentView)}

                    <AlertModal content={"Please unlock with your master passward!"}
                        isAlertModalOpen={this.state.modalIsOpen && (!this.state.unlocked)} close={this.cancelTX} />
                        {/*TODO: refactor this later*/}
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
                <ConfirmTXModal confirmTX={this.confirmTX} cancelTX={this.cancelTX} />
                    </Modal>
                    <ScheduleTXModal confirmScheduleTX={this.confirmScheduleTX} cancelScheduleTX={this.cancelScheduleTX} 
                    isScheduleModalOpen={this.state.scheduleModalIsOpen}/>
                    <Footer handleDrawer={this.handleClick} draw={this.state.drawerOut} />
                </div>
                <Drawer refs="underlayer" handleClick={this.handleClick} draw={this.state.drawerOut} />
            </div>
        )
    }

}


export default DashBoard

