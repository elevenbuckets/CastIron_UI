'use strict'
import CastIronActions from '../action/CastIronActions'
import React from 'react';
import DappViewService from '../service/DappViewService';
import Installer from '../util/Installer';
import AppInstallationModal from '../components/AppInstallationModal';
// Reflux components

class AppStore extends React.Component {
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
			return (<div className="card" onClick={this.handleIconClick.bind(this, key)}>
				<img src={src} style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
				<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>{key}</p>
			</div>)
		})
	}

	render = () => {
		console.log("in render() of Drawer")
		return (
			<div className="item cardHolder">
				<div className="card">
				<img src="assets/transfer-icon.png" className="cardicon"/>
				<p className="cardtext">Wallet App</p>
				<input type="button" className="button cardget" value="install" onClick=""/>
				</div>
				<div className="card">
				<img src="assets/delegate-icon.png" className="cardicon"/>
				<p className="cardtext">Delegate App</p>
				<input type="button" className="button cardget" value="install" onClick=""/>
				</div>
				<div className="card">
				<img src="assets/forum-icon.png" className="cardicon"/>
				<p className="cardtext">Forum App</p>
				<input type="button" className="button cardget" value="install" onClick=""/>
				</div>
				<div className="card">
				<img src="assets/plus-icon.png" className="cardicon"/>
				<p className="cardtext">Add More</p>
				<input type="button" className="button cardget" value="install" onClick=""/>
				</div>
			</div>
		)
	}
}

export default AppStore;
