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
            return (
                <div className="container locked">
                    <States />
                    <Login />
                </div>
            );
        } else {
            return (
                <div className="container unlocked">
                    <States />
                    <Accounts />
                    <MainView />
                </div>
            )
        }
    }
}


export default DashBoard

