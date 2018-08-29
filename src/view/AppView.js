'use strict'
import CastIronActions from '../action/CastIronActions'
import React from 'react';
import DappViewService from '../service/DappViewService';
import Installer from '../util/Installer';
import AppInstallationModal from '../components/AppInstallationModal';
// Reflux components

import AppStore from "./AppStore";
import AppDrawer from "./AppDrawer";

// Modals
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser'

class AppView extends AlertModalUser {
	constructor(props) {
		super(props);
		this.state = {
			isAppInstallationModalOpen : false,
			currentdAppSettings: 'drawer'

		}
	}

	changeView(view) {
		CastIronActions.changeView(view);
	}

	handleIconClick = (appView, event) => {
		this.changeView(appView);
		this.props.handleClick(event);
	}

	handleGoBackFromApps = () =>{
		this.setState({isAppInstallationModalOpen : false})
	}

	handleAddIconClick = () => {
		this.setState({isAppInstallationModalOpen:true})

		// let stage = Promise.resolve();
		// stage.then(() => {
		// 	// return Installer.fetchPackage("Schedular").then(()=>{
		// 	// 	return Installer.install("Schedular");
		// 	// });
		// 	return Installer.install("Schedular");

		// }).then(() => {
		// 	console.log("Drawer: before forceUpdate!")
		// 	this.forceUpdate();

		// });

		// console.log()

		// Installer.fetchPackage("Schedular")
		// Installer.install("Schedular")
	}

	install = () => {

		let stage = Promise.resolve();
		stage.then(() => {
			// return Installer.fetchPackage("Schedular").then(()=>{
			// 	return Installer.install("Schedular");
			// });
			return Installer.install("Schedular");

		}).then(() => {
			console.log("Drawer: before forceUpdate!")
			this.forceUpdate();

		});

		return stage;
	}

	getDappIcons = () => {
		console.log("getting Dapp Icons from Dapp view service:");
		console.log(Object.keys(DappViewService.viewMap));

		return Object.keys(DappViewService.viewMap).map((key) => {
			let src = "../dapps/" + key + "/assets/clock-icon.png";
			return (<div className="card" onClick={this.handleIconClick.bind(this, key)}>
				<img src={src} style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
				<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>{key}</p>
			</div>)
		})
	}

	handleChange = (tabName) => {
		this.setState({ currentdAppSettings: tabName });
	}

	render = () => {
		console.log("in render() of Drawer")
		return (
			<fieldset className="item dAppsView">
				<legend className="item dAppsTabs">
					<input type="button" className="button tabset" value="Browse dApps" style=
						{{
							backgroundColor: this.state.currentdAppSettings === 'browse' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentdAppSettings === 'browse' ? "black" : "white"
						}}
						onClick={this.handleChange.bind(this, "browse")} />
					<input type="button" className="button tabset" style=
						{{
							backgroundColor: this.state.currentdAppSettings === 'drawer' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentdAppSettings === 'drawer' ? "black" : "white"
						}} value="Installed Apps" onClick={this.handleChange.bind(this, "drawer")} />
				</legend>
					<div className="item dAppsViewInner">
						{
							this.state.currentdAppSettings === "browse" ? <AppStore />
								: this.state.currentdAppSettings === "drawer" ?<AppDrawer/>
									: this.setState({ currentdAppSettings: 'drawer' })
						}
					</div>
				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
			</fieldset>
		)
	}
}

export default AppView;
