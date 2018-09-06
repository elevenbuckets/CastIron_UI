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
	this.storeKeys = [ "unlocked", "currentView", "modalIsOpen", "scheduleModalIsOpen", "accounts", "retrying", "rpcfailed" ];
    }

    confirmTX = () => { CastIronActions.confirmTx(); }
    cancelTX = () => { CastIronActions.cancelTx(); }
    confirmScheduleTX = (queue) => { CastIronActions.confirmScheduleTx(queue); }
    cancelScheduleTX = () => { CastIronActions.cancelScheduleTx(); }
    reinit = () => { CastIronActions.initPlatform(); };

    render() {
        console.log("in Dashboard render()")

	if (this.state.retrying > 0 && this.state.rpcfailed === false) {
            document.body.style.background = "linear-gradient(100deg, rgb(17, 31, 47), rgb(24, 156, 195))";
            return (
		    <div className="container locked">
			<div className="item list"><p>Connecting to local geth RPC ({this.state.retrying + ' / 3'})</p></div>
		    </div>
	    );
	} else if ( this.state.retrying == 3 && this.state.rpcfailed === true ) {
            document.body.style.background = "linear-gradient(100deg, rgb(17, 31, 47), rgb(24, 156, 195))";
            return (
		    <div className="container locked">
			<div className="item list">
				<p style={{alignSelf: "flex-end"}}>
					Please check your geth RPC connection
				</p>
				<input style={{alignSelf: "baseline", justifySelf: "center", marginTop: "15px"}} 
				       type="button" className="button reload" value="retry" onClick={this.reinit} />
			</div>
		    </div>
	    );
	} else if (this.state.retrying == 0 && this.state.rpcfailed === false && this.state.unlocked === false) {
            document.body.style.background = "url(./assets/blockwall.png)";
            return (
                <div className="container locked">
                    <States />
                    <Login />
                </div>
            );
        } else if (this.state.retrying == 0 && this.state.rpcfailed === false && this.state.unlocked === true){
            document.body.style.background = "linear-gradient(200deg, rgb(17, 31, 47), rgb(24, 156, 195))";
            return (
                <div className="container unlocked">
                    <States />
                    <Accounts />
                    <MainView />
                    <Sidebar />
                    <Modal ariaHideApp={false} isOpen={this.state.modalIsOpen && this.state.unlocked} style=
                        {{
                            overlay: { width: '100%', maxHeight: '100%', zIndex: '5', backgroundColor: "rgba(0,12,20,0.75)" },
                            content: { 
                                top: '40%', left: '31%', right: '31%', bottom: '40%',
                                border: "2px solid yellow",
                                backgroundColor: "black",
                                borderRadius: "6px",
                                color: "yellow",
                                textAlign: "center",
                                fontSize: "26px",
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

