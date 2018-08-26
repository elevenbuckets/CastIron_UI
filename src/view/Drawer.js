'use strict'
import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import React from 'react';
import DappViewService from '../service/DappViewService';
import Installer from '../util/Installer'

// Reflux components

class Drawer extends React.Component {
	constructor(props) {
		super(props);
	}

	changeView(view) {
		CastIronActions.changeView(view);
	}

	handleIconClick = (appView, event) => {
		this.changeView(appView);
		this.props.handleClick(event);
	}

	handleAddIconClick = () =>{
		let stage = Promise.resolve();
		stage.then(() =>{
			return Installer.fetchPackage("Schedular").then(()=>{
				return Installer.install("Schedular");
			});
			// return Installer.install("Schedular");
			
		}).then(() =>{
				console.log("Drawer: before forceUpdate!")
				this.forceUpdate();
			
		});

		// console.log()
    
		// Installer.fetchPackage("Schedular")
		// Installer.install("Schedular")
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
			<div id="drawer" className="mainView">
				<div className="card" onClick={this.handleIconClick.bind(this, 'Transfer')}>
					<img src="assets/transfer-icon.png" style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
					<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>Wallet</p>
				</div>
				{this.getDappIcons()}
				<div className="card">
					<img src="assets/forum-icon.png" style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
					<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>Forum</p>
					<div className="label-soon">Comming Soon!</div>
				</div>
				<div className="card">
					<img src="assets/delegate-icon.png" style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
					<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>Delegates</p>
					<div className="label-soon">Comming Soon!</div>
				</div>

				<div className="card" onClick={this.handleAddIconClick.bind(this)}>
					<img src="assets/plus-icon.png" style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
					<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>Add</p>
				</div>
			</div>
		)
	}
}

export default Drawer
