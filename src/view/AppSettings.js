"use strict";

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import fs from 'fs';

// Modals
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser'

// Singleton services
import CastIronService from '../service/CastIronService';
import AcctMgrService from '../service/AcctMgrService';

// Reflux actions
import CastIronActions from '../action/CastIronActions';

// Reflux store
import CastIronStore from '../store/CastIronStore';

// View
import AppStore from "./AppStore";

class AppSettings extends AlertModalUser {
	constructor(props) {
		super(props);
		this.store = CastIronStore;
		this.state = {
			currentdAppSettings: 'store'  // store || installed || dappcfgs
		};
	}

	handleChange = (tabName) => {
		this.setState({ currentdAppSettings: tabName });
	}

	render = () => {
		console.log("in settings render ...")
		return (
			<fieldset className="item dAppsView">
				<legend className="item dAppsTabs">
					<input type="button" className="button tabset" value="Browse dApp Store" style=
						{{
							backgroundColor: this.state.currentdAppSettings === 'store' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentdAppSettings === 'store' ? "black" : "white"
						}}
						onClick={this.handleChange.bind(this, "store")} />
					<input type="button" className="button tabset" style=
						{{
							backgroundColor: this.state.currentdAppSettings === 'installed' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentdAppSettings === 'installed' ? "black" : "white"
						}} value="Installed dApps" onClick={this.handleChange.bind(this, "installed")} />
					<input type="button" className="button tabset" value="Configurations" style=
						{{
							backgroundColor: this.state.currentdAppSettings === 'appcfgs' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentdAppSettings === 'appcfgs' ? "black" : "white"
						}} onClick={this.handleChange.bind(this, "appcfgs")} />
				</legend>
				{ 
					<div className="item dAppsViewInner">
						{
							this.state.currentdAppSettings === "store" ? <AppStore />
								: this.state.currentdAppSettings === "installed" ? "This is where all installed apps are listed"
									: this.state.currentdAppSettings === "appcfgs" ? "This is where installed apps get configured"
										: this.setState({ currentdAppSettings: 'store' })
						}
					</div>
				}	
				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
			</fieldset>
		);
	}
}

export default AppSettings;
