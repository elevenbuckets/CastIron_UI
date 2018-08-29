'use strict'
import CastIronActions from '../action/CastIronActions'
import React from 'react';
import DappViewService from '../service/DappViewService';
import Installer from '../util/Installer';
import AppInstallationModal from '../components/AppInstallationModal';
// Reflux components

class AppDrawer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAppInstallationModalOpen : false
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


			return (<div className="card appcard" onClick={this.handleIconClick.bind(this, key)}>
			<img src={src} className="cardicon"/>
			<p className="cardtext">{key}</p>
			</div>)
		})
	}

	render = () => {
		console.log("in render() of Drawer")
		return (
			<div className="appHolder">
				<div className="card appcard">
				<img src="assets/transfer-icon.png" className="cardicon"/>
				<p className="cardtext">Wallet App</p>
				</div>
			{this.getDappIcons()}
			</div>
		)
	}
}

export default AppDrawer
