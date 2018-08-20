import Reflux from 'reflux';
import React from 'react';

import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser'
import fs from 'fs';
import CastIronService from '../service/CastIronService';
import CastIronActions from '../action/CastIronActions';
import AcctMgrService from '../service/AcctMgrService';
import CastIronStore from '../store/CastIronStore';

class Settings extends AlertModalUser {
	constructor(props) {
		super(props);
		this.store = CastIronStore;

		this.state = {
			reveal: false,
			reveal2: false,
			waiting: false
		}

		this.wallet = CastIronService.wallet;
		this.accMgr = AcctMgrService.accMgr;
		this.variable = undefined;
		this.keypath = undefined;
	}

	handleCustomGasPriceUpdate = (event) => {
		let value = event.target.value;
		if (isNaN(value)) {
			this.openModal("Please enter a number!")
			event.target.value = value.slice(0, -1);
		} else {
			this.props.handleCustomGasPriceUpdate(parseInt(event.target.value))
		}
	}

	handleClickBack = () => {
		if (!this.props.isCustomGasPriceValid()) {
			this.openModal("Please enter custom gas price!")
		} else {
			this.props.handleClickBack();
			CastIronActions.infoUpdate();
		}
	}

	handleNewAcct = (event) => {
		let stage = Promise.resolve();
		stage
			.then(() => {
				this.refs.fi.disabled = true;
				this.refs.fa.disabled = true;
				return this.setState({ waiting: true })
			})
			.then(() => { this.updateNew(); });
	}

	updateNew = () => {
		console.log("calling update now");
		return this.accMgr.newAccount(this.variable).then((address) => {
			this.variable = undefined;
			this.refs.vip.value = '';
			this.setState({ waiting: false });
			this.openModal("New Address: " + address);
			this.refs.fi.disabled = false;
			this.refs.fa.disabled = false;
		})
			.catch((err) => {
				this.variable = undefined;
				this.refs.vip.value = '';
				this.setState({ waiting: false });
				this.openModal("Creation Failed");
				this.refs.fi.disabled = false;
				this.refs.fa.disabled = false;
			});
	}

	handleReveal = (event) => {
		this.setState({ reveal: !this.state.reveal });
	}

	handleReveal2 = (event) => {
		this.setState({ reveal2: !this.state.reveal2 });
	}

	handleImport = (event) => {
		console.log("Importing " + this.keypath);
		this.setState({ waiting: true });
		this.refs.fi.disabled = true;
		this.refs.fa.disabled = true;
		this.accMgr.importFromJSON(this.keypath, this.variable).then((r) => {
			this.accMgr.update(r.keyObj, r.password).then((address) => {
				r = {};
				this.refs.vif.value = '';
				this.keypath = undefined;
				this.refs.vop.value = '';
				this.variable = undefined;
				this.setState({ waiting: false });
				this.openModal("Imported Address: " + address);
				this.refs.fi.disabled = false;
				this.refs.fa.disabled = false;
			});
		})
			.catch((err) => {
				this.refs.vif.value = '';
				this.keypath = undefined;
				this.refs.vop.value = '';
				this.variable = undefined;
				this.setState({ waiting: false });
				this.openModal("Import Failed!");
				this.refs.fi.disabled = false;
				this.refs.fa.disabled = false;
			})
	}

	updateVar = (event) => {
		this.variable = event.target.value;
	}

	updatePath = (event) => {
		console.log(this.refs.vif.files[0].path);
		this.keypath = this.refs.vif.files[0].path;
	}

	accountMgr = () => {
		return (
			<div style={{ align: 'center' }}>
				<fieldset ref="fa" id="fa" onMouseEnter={this.handleHover.bind(this, 'fa')} onMouseLeave={this.handleNoHover.bind(this, 'fa')}
					style={{ display: 'inline-block', marginLeft: '130px', padding: '20px' }}>
					<legend style={{ fontWeight: 'bold', marginBottom: '3px' }}>Create New Account:</legend>
					Please Enter Password For New Account:<br />
					<input ref="vip" style={{ marginLeft: '6px' }} type={this.state.reveal ? "text" : "password"} onChange={this.updateVar} />
					<input type="button" style={{ marginRight: '6px' }} value={this.state.reveal ? "Hide" : "Reveal"} onClick={this.handleReveal} />
					{this.state.waiting
						? <div className="loader" style={{ height: '13px', width: '13px', display: "inline-block" }}></div>
						: <input type="button" value="Create" onClick={this.handleNewAcct} />}
				</fieldset>
				<fieldset ref="fi" id="fi" onMouseEnter={this.handleHover.bind(this, 'fi')} onMouseLeave={this.handleNoHover.bind(this, 'fi')}
					style={{ display: 'inline-block', padding: '20px' }}>
					<legend style={{ fontWeight: 'bold' }}>Import Account:</legend>
					Please Select File:
				      <input ref="vif" style={{ marginLeft: '6px' }} type='file' onChange={this.updatePath} /><br />
					Please Enter Password Of The Account:
				      <input ref="vop" style={{ marginLeft: '6px' }} type={this.state.reveal2 ? "text" : "password"} onChange={this.updateVar} />
					<input type="button" style={{ marginRight: '6px' }} value={this.state.reveal2 ? "Hide" : "Reveal"} onClick={this.handleReveal2} />
					{this.state.waiting
						? <div className="loader" style={{ height: '13px', width: '13px', display: "inline-block" }}></div>
						: <input type="button" value="Create" onClick={this.handleImport} />}
				</fieldset>
			</div>
		)
	}

	handleChange = (tabName) => {
		this.setState({currentSettings: tabName});
	}

	render = () => {
		return (
			<fieldset className="SettingView">
				<legend className="item SettingTabs">
					<input type="button" className="button tabset" value="Gas Price" onClick={this.handleChange.bind(this, "gas")} />
					<input type="button" className="button tabset" value="Accounts" onClick={this.handleChange.bind(this, "acc")} />
					<input type="button" className="button tabset" value="Apps" onClick={this.handleChange.bind(this, "app")} />
				</legend>
				<div className="SettingInner">
				{ 
					this.state.currentSettings === "gas" ? "This is gas price change page" 
					: this.state.currentSettings === "acc" ? "This is account management page"
					: this.state.currentSettings === "app" ? "This is dApp settings page"
					: "Error: unknown setting tab!"
				}
				</div>
				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
			</fieldset>
		);
	}
}

export default Settings;
