'use strict'

// Third-parties
import Reflux from 'reflux';
import React from 'react';

// Reflux store
import CastIronStore from '../store/CastIronStore';

// Reflux action
import CastIronActions from '../action/CastIronActions'

// Singleton service
import DappViewService from '../service/DappViewService';

// Views
import Transfer from "./Transfer";
import ReceiptsView from "./ReceiptsView";
import Settings from "./Settings";
import AppView from "./AppView";

// Reflux components
class MainView extends Reflux.Component {
	constructor(props) {
		super(props);
		this.store = CastIronStore;
		this.storeKeys = [ "currentView" ];
	}

	render = () => {
		return (
			<div className="mainView">
				{  this.state.currentView == "Transfer" ? <Transfer /> 
				 : this.state.currentView == "Receipts" ? <ReceiptsView /> 
				 : this.state.currentView == "Settings" ? <Settings />
				 : this.state.currentView == "AppView" ? <AppView />
				 : DappViewService.getView(this.state.currentView)  }
			</div>
		)
	}
}

export default MainView;