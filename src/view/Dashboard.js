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
import Login from './Login';
import MainView from './MainView';
import Sidebar from './Sidebar';
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

        if (this.state.unlocked === false) {
            document.body.style.background = "url(./assets/blockwall.png)";
            return (
                <div className="container locked">
                    <States />
                    <Login />
                </div>
            );
        } else {
            document.body.style.background = "linear-gradient(10deg, rgb(21, 2, 32), rgb(18, 121, 161))";
            return (
                <div className="container unlocked">
                    <States />
                    <Accounts />
                    <MainView />
                    <Sidebar />
                    <Modal isOpen={this.state.modalIsOpen && this.state.unlocked} style=
                        {{
                            overlay: { width: '100%', maxHeight: '100%', zIndex: '5' },
                            content: { 
                                top: '40%', left: '40%', right: '40%', bottom: '40%',
                                border: "2px solid yellow",
                                backgroundColor: "black",
                                borderRadius: "6px",
                                color: "yellow",
                                textAlign: "center",
                                fontSize: "30px",
                                display: "grid",
                                padding: "0px",
                                gridTemplateRows: "1fr 1fr",
                                gridTemplateColumns: "1fr",
                                alignItems: "center"},
                        }}> Please confirm!
                      <ConfirmTXModal confirmTX={this.confirmTX} cancelTX={this.cancelTX} />
                    </Modal>
                    <ScheduleTXModal confirmScheduleTX={this.confirmScheduleTX} cancelScheduleTX={this.cancelScheduleTX}
                    isScheduleModalOpen={this.state.scheduleModalIsOpen}/>
                </div>
            )
        }
    }
}

export default DashBoard;

