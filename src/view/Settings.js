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

class Settings extends AlertModalUser {
	constructor(props) {
		super(props);
		this.store = CastIronStore;

		this.state = {
			reveal: false,
			reveal2: false,
			waiting: false,
			currentSettings: 'gas',
			currentAccSettings: 'new'
		}

		this.wallet = CastIronService.wallet;
		this.accMgr = AcctMgrService.accMgr;
		this.variable = undefined;
		this.keypath = undefined;
	}

	// Gas related functions
	handleCustomGasPriceUpdate = (event) => {
		let value = event.target.value;
		if (isNaN(value)) {
			this.openModal("Please enter a number!")
			event.target.value = value.slice(0, -1);
		} else {
			CastIronActions.customGasPriceUpdate(parseInt(event.target.value));
		}
	}

	isCustomGasPriceValid = () => {
		return (this.state.gasPriceOption != "custom" || this.state.customGasPrice)
	}

	isCustomGasPrice = () => {
		return this.state.gasPriceOption == 'custom';
	}

	handleGasPriceSelect = (event) => {
		event.currentTarget.checked = 'checked';
		CastIronActions.gasPriceOptionSelect(event.currentTarget.defaultValue);
	}

	handleClickBack = () => {
		if (!this.isCustomGasPriceValid()) {
			this.openModal("Please enter custom gas price!")
		} else {
			this.props.handleClickBack();
			CastIronActions.infoUpdate();
		}
	}

	handleNewAcct = (event) => {
		let stage = Promise.resolve();

		if (typeof(this.variable) === 'undefined' || this.variable.length === 0) {
			this.variable = undefined;
			this.refs.vip.value = '';
			this.setState({ waiting: false });
			this.openModal("Creation Failed");
			return false;
		}

		stage
			.then(() => {
				return this.setState({ waiting: true })
			})
			.then(() => { 
				return this.updateNew(); 
			});
	}

	updateNew = () => {
		console.log("calling update now");
		return this.accMgr.newAccount(this.variable).then((address) => {
			this.variable = undefined;
			this.setState({ waiting: false });
			this.openModal("New Address: " + address);
			CastIronActions.infoUpdate();
		})
			.catch((err) => {
				this.variable = undefined;
				this.setState({ waiting: false });
				this.openModal("Creation Failed");
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
		this.accMgr.importFromJSON(this.keypath, this.variable).then((r) => {
			this.accMgr.update(r.keyObj, r.password).then((address) => {
				r = {};
				this.keypath = undefined;
				this.variable = undefined;
				this.setState({ waiting: false });
				this.openModal("Imported Address: " + address);
			});
		})
			.catch((err) => {
				this.keypath = undefined;
				this.variable = undefined;
				this.setState({ waiting: false });
				this.openModal("Import Failed!");
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
		if (this.state.waiting === true) {
			return (
				<div className="item newAccTab">
					<p className="nawaiting">Please Wait ...</p>
				</div>
			)
		} else {
			const __oldAcc = () => {
				return (
					<div className="item newAccTab">
					    <p className="item nafile">Please Select File:
				      		<input ref="vif" style={{ margin: '15px' }} type='file' onChange={this.updatePath}/>
					    </p>
						<p className="natitle">Please Enter Password of The Account:</p>
						<input ref="vip1" className="napass" type={this.state.reveal ? "text" : "password"} onChange={this.updateVar} />
						<input type="button" style={{margin: "15px"}} className="button nareveal"  
							   value={this.state.reveal ? "Hide" : "Reveal"} onClick={this.handleReveal} />
						<input type="button"  style={{margin: "15px"}} 
							   className='button nacreate' 
								value='Import' 
							 onClick={this.handleImport} />
					</div>
				)
			}

			const __newAcc = () => {
				return (
					<div className="item newAccTab">
						<p className="natitle" >Please Enter Password For New Account:</p>
						<input ref="vip2" className="napass" type={this.state.reveal2 ? "text" : "password"} onChange={this.updateVar} />
						<input type="button" style={{margin: "15px"}} className="button nareveal"  
							   value={this.state.reveal2 ? "Hide" : "Reveal"} 
							onClick={this.handleReveal2} />
						<input type="button"  style={{margin: "15px"}} 
							   className='button nacreate' 
								value='Create' 
							 onClick={this.handleNewAcct} />
					</div>
				)
			}

			return (
				<div className="item accMgr">
					<fieldset className="accSettings">
						<legend className="item accTabs">
						<input type="button" className="button tabset" value="Create New Account" style=
							{{
								backgroundColor: this.state.currentAccSettings === 'new' ? "white" : "rgba(0,0,0,0)",
								color: this.state.currentAccSettings === 'new' ? "black" : "white"
							}}
							onClick={this.handleAccChange.bind(this, "new")} />
						<input type="button" className="button tabset" value="Import Existing Account" style=
							{{
								backgroundColor: this.state.currentAccSettings === 'old' ? "white" : "rgba(0,0,0,0)",
								color: this.state.currentAccSettings === 'old' ? "black" : "white"
							}}
							onClick={this.handleAccChange.bind(this, "old")} />
						</legend>
						{  this.state.currentAccSettings === 'new' ? __newAcc()
						 : this.state.currentAccSettings === 'old' ? __oldAcc()
						 : this.setState({currentAccSettings: 'new'})}
					</fieldset>
				</div>
			)
		}
	}

	gasSettings = () => {
		return (
			<form style={{ fontSize: "18px", textAlign: 'center' }} onSubmit={(e) => { e.preventDefault() }} >
				<table style={{border: "0px"}}><tbody>
						<tr>
							<td>
								<label><input type="radio"
									onChange={this.handleGasPriceSelect} name="gasprice" value="low" 
									checked={this.state.gasPriceOption === 'low' ? "checked" : false}/>{"Slow(" + this.state.gasPriceInfo.low +  ")" }</label><br />
							</td>
							<td>
								<label><input type="radio"
									onChange={this.handleGasPriceSelect} name="gasprice" value="mid"
									checked={this.state.gasPriceOption === 'mid' ? "checked" : false} />{"Mid(" + this.state.gasPriceInfo.mid +  ")" }</label><br />
							</td>
							<td>
								<label><input type="radio"
									onChange={this.handleGasPriceSelect} name="gasprice" value="high" 
									checked={this.state.gasPriceOption === 'high' ? "checked" : false} />{"Normal(" + this.state.gasPriceInfo.high +  ")" }</label><br />
							</td>
							<td>
								<label><input type="radio"
									onChange={this.handleGasPriceSelect} name="gasprice" value="fast" 
									checked={this.state.gasPriceOption === 'fast' ? "checked" : false}/>{"Fast(" + this.state.gasPriceInfo.fast +  ")" }</label><br />
							</td>
							<td>
								<label><input type="radio"
									onChange={this.handleGasPriceSelect} name="gasprice" value="custom"
									checked={this.state.gasPriceOption === 'custom' ? "checked" : false}/>Custom
						<input type="text" style=
						{{  
							marginLeft: "15px",
							width: "120px", 
							backgroundColor: "rgba(0,0,0,0)", 
							border: "2px solid white",
							fontSize: "18px",
							color: "white",
							textAlign: "right",
							paddingRight: "4px"
						}} name="custom_gasprice"
										value={this.state.gasPriceOption === 'custom' ? (this.state.customGasPrice? this.state.customGasPrice : 0) :""}
										disabled={!this.isCustomGasPrice} onChange={this.handleCustomGasPriceUpdate} placeholder="Unit: gwei" />
								</label>
							</td></tr>
                    
                </tbody></table>
				</form>
		);
	}

	handleChange = (tabName) => {
		this.setState({ currentSettings: tabName });
	}

	handleAccChange = (tabName) => {
		this.setState({ currentAccSettings: tabName });
	}

	render = () => {
		return (
			<fieldset className="item SettingView">
				<legend className="item SettingTabs">
					<input type="button" className="button tabset" value="Gas Price" style=
						{{
							backgroundColor: this.state.currentSettings === 'gas' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentSettings === 'gas' ? "black" : "white"
						}}
						onClick={this.handleChange.bind(this, "gas")} />
					<input type="button" className="button tabset" style=
						{{
							backgroundColor: this.state.currentSettings === 'acc' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentSettings === 'acc' ? "black" : "white"
						}} value="Accounts" onClick={this.handleChange.bind(this, "acc")} />
					<input type="button" className="button tabset" value="Applications" style=
						{{
							backgroundColor: this.state.currentSettings === 'app' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentSettings === 'app' ? "black" : "white"
						}} onClick={this.handleChange.bind(this, "app")} />
				</legend>
				<div className="item SettingInner">
					{
						this.state.currentSettings === "gas" ? this.gasSettings()
							: this.state.currentSettings === "acc" ? this.accountMgr()
								: this.state.currentSettings === "app" ? <AppSettings />
									: this.setState({ currentSettings: 'gas' })
					}
				</div>
				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
			</fieldset>
		);
	}
}

export default Settings;
