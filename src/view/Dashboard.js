'use strict';

// Major third-party modules
import React, { Component } from 'react';
import Reflux from 'reflux';
import Modal from 'react-modal';

// Singleton services
import CastIronService from '../service/CastIronService';
import DappViewService from '../service/DappViewService';

// Reflux store
import CastIronStore from '../store/CastIronStore';

// Reflux actions
import CastIronActions from '../action/CastIronActions';

// Views
import States from './States';
import Accounts from './Accounts';
import Drawer from './Drawer';
//import ReceiptsView from './ReceiptsView';

// Modals
import ConfirmTXModal from '../components/ConfirmTXModal';
import AlertModal from '../components/AlertModal';
import ScheduleTXModal from '../components/ScheduleTXModal';

class DashBoard extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.state = {
            drawerOut: false
        }
	this.storeKeys = [ "unlocked", "currentView", "modalIsOpen", "scheduleModalIsOpen", "accounts" ];

    }

    confirmTX = () => { CastIronActions.confirmTx(); }
    cancelTX = () => { CastIronActions.cancelTx(); }
    confirmScheduleTX = (queue) => { CastIronActions.confirmScheduleTx(queue); }
    cancelScheduleTX = () => { CastIronActions.cancelScheduleTx(); }

    render() {
        console.log("in Dashboard render()")
        return (
            <div className="container">
                <States />
                <Accounts />
                <Drawer />
                <AlertModal 
                    content={"Please unlock with your master passward!"}
                    isAlertModalOpen={this.state.modalIsOpen && (!this.state.unlocked)} close={this.cancelTX} />
                <Modal isOpen={this.state.modalIsOpen && this.state.unlocked} 
                        style= {
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
            </div>
        )
    }
}


export default DashBoard

