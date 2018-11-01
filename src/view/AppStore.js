'use strict'
import CastIronActions from '../action/CastIronActions'
import React from 'react';
import DappViewService from '../service/DappViewService';
import Installer from '../util/Installer';
// Reflux components

class AppStore extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            availableApps: {
                Schedular: {
					installButtonValue : "Install"
				},
				DLogs: {
					installButtonValue : "Install"
                }
            }
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

	handleClickInstall = (appName) => {

        let stage = Promise.resolve();
        stage.then(() => {
            return this.setState({
                availableApps: {
                    [appName]: {
                        installButtonValue: "Installing..."
                    }
                }
            });

        }).then(() => {
            return  this.install(appName);

        }).then(()=>{
            return this.setState({
                availableApps: {
                    [appName]: {
                        installButtonValue: "Remove"
                    }
                }
            });
        });

       
    }

	install = (appName) => {

		let stage = Promise.resolve();
		stage.then(() => {
			// return Installer.fetchPackage("Schedular").then(()=>{
			// 	return Installer.install("Schedular");
			// });
			return Installer.install(appName);

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
				<p className="cardtext">DLogs</p>
				<input type="button" className="button cardget" value={this.state.availableApps.DLogs.installButtonValue}
				onClick={this.handleClickInstall.bind(this, "DLogs")}/>
				</div>
				<div className="card">
				<img src="assets/clock-icon.png" className="cardicon"/>
				<p className="cardtext">Schedular</p>
				<input type="button" className="button cardget" 
				value="Install" 
				onClick={this.handleClickInstall.bind(this, "Schedular")}/>
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
