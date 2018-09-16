"use strict";

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import fs from 'fs';
import path from 'path';
const remote = require('electron').remote;

// Modals
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser'

// Singleton services
import CastIronService from '../service/CastIronService';
import AcctMgrService from '../service/AcctMgrService';
import ConfigWriterService from '../service/ConfigWriterService';

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
			currentAccSettings: 'old',
			tokenAction: "",
			tokenToAdd: {
				symbol: '',
				token: {
					addr: 'default',
					name: '',
					decimals: "",
					category: 'Customized',
					watched: false
				}
			},
			selectedTokens: []
		}


		this.wallet = CastIronService.wallet;
		this.accMgr = AcctMgrService.accMgr;
		this.keypath = undefined;
		this.variable = undefined;
	}


	initializeAvaibleTokens = () => {
		let availableTokensFromCastIron = { ...CastIronService.wallet.defaultTokenList };
		Object.keys(availableTokensFromCastIron).map((key) => {
			availableTokensFromCastIron[key] = {
				...availableTokensFromCastIron[key],
				category: "default", watched: this.state.tokenList.includes(key)
			}
		})


		// Now the custom tokens info is in config.json, may refactor it to its own file in future
		this.cfgobj = remote.getGlobal('cfgobj');
		let availableTokensFromCustomer = require(path.join(this.cfgobj.configDir, "config.json")).tokens;
		Object.keys(availableTokensFromCustomer).map((key) => {
			availableTokensFromCustomer[key] = {
				...availableTokensFromCustomer[key],
				category: "Customized", watched: this.state.tokenList.includes(key)
			}
		})
		this.state.availableTokens = { ...availableTokensFromCastIron, ...availableTokensFromCustomer };
	}

	componentDidMount = () => {
		this.initializeAvaibleTokens();
	}

	// Gas related functions
	handleCustomGasPriceUpdate = (event) => {
		let value = event.target.value;
		if (isNaN(value)) {
			this.openModal("Please enter a number!")
			event.target.value = value.slice(0, -1);
		} else {
			CastIronActions.customGasPriceUpdate(event.target.value);
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

		if (typeof (this.variable) === 'undefined' || this.variable.length === 0) {
			this.variable = undefined;
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
		// sanity check
		if (!fs.existsSync(this.keypath) || typeof (this.keypath) === 'undefined') {
			this.keypath = undefined;
			this.variable = undefined;
			this.setState({ waiting: false });
			this.openModal("Import Failed!");
			return false;
		} else {
			console.log("Importing " + this.keypath);
			this.setState({ waiting: true });
		}

		this.accMgr.importFromJSON(this.keypath, this.variable).then((r) => {
			this.accMgr.update(r.keyObj, r.password).then((address) => {
				r = {};
				this.keypath = undefined;
				this.variable = undefined;
				this.setState({ waiting: false });
				this.openModal("Imported Address: " + address);
				CastIronActions.infoUpdate();
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
					<p className="item nawaiting">Please Wait ...</p>
				</div>
			)
		} else {
			const __oldAcc = () => {
				return (
					<div className="item newAccTab">
						<p className="item nafile">Please Select File:
				      		<input ref="vif" style={{ margin: '15px' }} type='file' onChange={this.updatePath} />
						</p>
						<p className="natitle">Please Enter Password of The Account:</p>
						<input ref="vip1" className="napass" type={this.state.reveal ? "text" : "password"} defaultValue='' onChange={this.updateVar} />
						<input type="button" style={{ margin: "15px" }} className="button nareveal" value={this.state.reveal ? "Hide" : "Reveal"} onClick={this.handleReveal} />
						<input type="button" style={{ margin: "15px" }} className='button nacreate' value='Import' onClick={this.handleImport} />
					</div>
				)
			}

			const __newAcc = () => {
				return (
					<div className="item newAccTab">
						<p className="natitle" >Please Enter Password For New Account:</p>
						<input ref="vip2" className="napass" type={this.state.reveal2 ? "text" : "password"} defaultValue='' onChange={this.updateVar} />
						<input type="button" style={{ margin: "15px" }} className="button nareveal" value={this.state.reveal2 ? "Hide" : "Reveal"} onClick={this.handleReveal2} />
						<input type="button" style={{ margin: "15px" }}
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
						{this.state.currentAccSettings === 'new' ? __newAcc()
							: this.state.currentAccSettings === 'old' ? __oldAcc()
								: this.setState({ currentAccSettings: 'old' })}
					</fieldset>
				</div>
			)
		}
	}

	gasSettings = () => {
		return (
			<form style={{ fontSize: "18px", textAlign: 'center' }} onSubmit={(e) => { e.preventDefault() }} >
				<table style={{ border: "0px" }}><tbody>
					<tr>
						<td>
							<label><input type="radio"
								onChange={this.handleGasPriceSelect} name="gasprice" value="low"
								checked={this.state.gasPriceOption === 'low' ? "checked" : false} />{"Slow (" + this.wallet.toEth(this.state.gasPriceInfo.low, 9).toString() + ")"}</label><br />
						</td>
						<td>
							<label><input type="radio"
								onChange={this.handleGasPriceSelect} name="gasprice" value="mid"
								checked={this.state.gasPriceOption === 'mid' ? "checked" : false} />{"Mid (" + this.wallet.toEth(this.state.gasPriceInfo.mid, 9).toString() + ")"}</label><br />
						</td>
						<td>
							<label><input type="radio"
								onChange={this.handleGasPriceSelect} name="gasprice" value="high"
								checked={this.state.gasPriceOption === 'high' ? "checked" : false} />{"Normal (" + this.wallet.toEth(this.state.gasPriceInfo.high, 9).toString() + ")"}</label><br />
						</td>
						<td>
							<label><input type="radio"
								onChange={this.handleGasPriceSelect} name="gasprice" value="fast"
								checked={this.state.gasPriceOption === 'fast' ? "checked" : false} />{"Fast (" + this.wallet.toEth(this.state.gasPriceInfo.fast, 9).toString() + ")"}</label><br />
						</td>
						<td>
							<label><input type="radio"
								onChange={this.handleGasPriceSelect} name="gasprice" value="custom"
								checked={this.state.gasPriceOption === 'custom' ? "checked" : false} />Custom
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
									value={this.state.gasPriceOption === 'custom' ? (this.state.customGasPrice ? this.state.customGasPrice : undefined) : ""}
									disabled={!this.isCustomGasPrice} onChange={this.handleCustomGasPriceUpdate} placeholder="Unit: gwei" />
							</label>
						</td></tr>

				</tbody></table>
			</form>
		);
	}

	tokensSettings = () => {
		return (
			<div className="TQList">
				<table className="balance-sheet">
					<tbody>
						<tr className="balance-sheet">
							<td className="txform" style={{ border: '0', textAlign: "left" }}>
								<input type="button" className="button" value='New' onClick={this.newToken} />
								<input type="button" className="button" value='Edit' disabled={true}/>
								<input type="button" className="button" value='Search' disabled={true}/>
								<input type="button" className="button" value='Delete' disabled={true}/>
								<input type="button" className="button" value='Watch' onClick={this.handleClickWatchToken} />
								<input type="button" className="button" value='UnWatch' onClick={this.handleClickUnWatchToken} />
							</td>
						</tr>

					</tbody>
				</table>
				<table style={{ width: "100%" }}>
					<tbody>
						<tr>
							<td width='5%'>Select</td>
							<td width='3%'>Symbol</td>
							<td width='32%'>Address</td>
							<td width='10%'>Name</td>
							<td width='10%'>Decimals</td>
							<td width='10%'>Catgory</td>
							<td width='10%'>Watched</td>
						</tr>
						<tr hidden={!(this.state.tokenAction === "New")}>
							<td width='5%'></td>
							<td width='3%'><input type='text' size='3'
								onChange={this.changeNewTokenField.bind(this, "symbol")}
							/></td>
							<td width='32%'><input type='text' size='20'
								onChange={this.changeNewTokenField.bind(this, "addr")}
							/></td>
							<td width='10%'><input type='text' size='10'
								onChange={this.changeNewTokenField.bind(this, "name")}
							/></td>
							<td width='10%'><input type='text' size='10'
								onChange={this.changeNewTokenField.bind(this, "decimals")}
							/></td>
							<td width='10%'></td>
							<td width='10%'><input type='button' className="button" value='Add'
								onClick={this.handleClickAddToken}
							/></td>

						</tr>
						<tr hidden={!(this.state.tokenAction === "Search")}>
							<td width='5%'></td>
							<td width='3%'><input type='text' size='3'
								onChange={this.changeTokenFilter.bind(this, "symbol")}
							/></td>
							<td width='32%'><input type='text' size='20'
								onChange={this.changeTokenFilter.bind(this, "addr")}
							/></td>
							<td width='10%'><input type='text' size='10'
								onChange={this.changeTokenFilter.bind(this, "name")}
							/></td>
							<td width='10%'><input type='text' size='10'
								onChange={this.changeTokenFilter.bind(this, "decimals")}
							/></td>
							<td width='10%'><input type='text' size='5'
								onChange={this.changeTokenFilter.bind(this, "category")}
							/></td>
							<td width='10%'><input type='text' size='10'
								onChange={this.changeTokenFilter.bind(this, "watched")}
							/></td>

						</tr>
						{Object.keys(this.state.availableTokens).map((key) => {
							let token = this.state.availableTokens[key];
							return (
								<tr>
									<td className="balance-sheet"
										width='5%'><input
											name="check"
											type="checkbox"
											checked={this.state.selectedTokens.includes(key)}
											onChange={this.checkToken.bind(this, key)}
											style={{ width: "25px", height: "25px" }} /></td>
									<td width='3%'>{key}</td>
									<td width='32%'>{token.addr}</td>
									<td width='10%'>{token.name}</td>
									<td width='10%'>{token.decimals}</td>
									<td width='10%'>{token.category}</td>
									<td width='10%'>{token.watched ? "Yes" : "No"}</td>

								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}

	changeTokenFilter = (field, event) => {
		// let filter =  {...this.tokenFilter, [field] : event.target.value}
        // if(event.target.value == ""){
        //     delete filter[field];
        // }
        // let filteredQs = this.state.scheduledQs;
        // filteredQs = filteredQs.filter(q => {
        //     return Object.keys(filter).reduce((match, key) =>{
        //        return match && q[key].includes(filter[key]);
        //     }, true)
        //     // return JSON.stringify(q) == JSON.stringify({ ...q, ...filter });
        // })
        // setDappLocalState(this, {filter: filter, filteredQs : filteredQs })
	}
	newToken = () => {
		if (this.state.tokenAction === "New") {
			this.setState({ tokenAction: "" })
		} else {
			this.setState({ tokenAction: "New" })
		}

	}

	addToken = tokenToAdd => {
		this.setState({ availableTokens: { ...this.state.availableTokens, [tokenToAdd.symbol]: tokenToAdd.token } });



		// udpate the tokens in configuration file
		const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI",
			"condition", "networkID", "tokens", "watchTokens", "passVault"];
		this.cfgobj = remote.getGlobal('cfgobj');
		let json = require(path.join(this.cfgobj.configDir, "config.json"))
		let availableTokensFromCustomer = json.tokens;
		let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.cfgobj.configDir, "config.json"), castIronFields);
		availableTokensFromCustomer = {
			...availableTokensFromCustomer, [tokenToAdd.symbol]:
				{ addr: tokenToAdd.token.addr, name: tokenToAdd.token.name, decimals: tokenToAdd.token.decimals }
		};

		//TODO: change it to use addKeyValue in future
		json.tokens = availableTokensFromCustomer;
		castIronWriter.writeJSON(json);


		// udpate the tokenList in wallet
		this.wallet.TokenList = {
			...this.wallet.TokenList, [tokenToAdd.symbol]:
				{ addr: tokenToAdd.token.addr, name: tokenToAdd.token.name, decimals: tokenToAdd.token.decimals }
		}
	}

	handleClickAddToken = () => {
		this.addToken(this.state.tokenToAdd)
	}

	checkToken = (token, event) => {
		if (event.target.checked) {
			if (!this.state.selectedTokens.includes(token)) {
				this.setState({ selectedTokens: [...this.state.selectedTokens, token] })
			}
		} else {
			if (this.state.selectedTokens.includes(token)) {
				let selectedTokens = [...this.state.selectedTokens];
				selectedTokens.splice(selectedTokens.indexOf(token), 1);
				this.setState({ selectedTokens: selectedTokens })
			}

		}
	}

	handleClickWatchToken = () => {
		let selectedTokens = this.state.selectedTokens;
		selectedTokens.map((token) => {
			let availableTokens = this.state.availableTokens;
			if (!availableTokens[token].watched) {
				CastIronActions.watchedTokenUpdate("Add", token);
				availableTokens[token].watched = true;
			}
			this.setState({ availableTokens: availableTokens });
		})

		this.setState({ selectedTokens: [] });

		// udpate the tokens in configuration file
		const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI",
			"condition", "networkID", "tokens", "watchTokens", "passVault"];
		this.cfgobj = remote.getGlobal('cfgobj');
		let json = require(path.join(this.cfgobj.configDir, "config.json"))
		let watchTokens = json.watchTokens;
		let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.cfgobj.configDir, "config.json"), castIronFields);
		watchTokens = [...watchTokens, ...selectedTokens]

		//TODO: change it to use addKeyValue in future
		json.watchTokens = watchTokens;
		castIronWriter.writeJSON(json);


	}

	handleClickUnWatchToken = () => {
		this.cfgobj = remote.getGlobal('cfgobj');
		let json = require(path.join(this.cfgobj.configDir, "config.json"))
		let watchTokens = json.watchTokens;
		let selectedTokens = this.state.selectedTokens;
		selectedTokens.map((token) => {
			let availableTokens = this.state.availableTokens;
			if (availableTokens[token].watched) {
				CastIronActions.watchedTokenUpdate("Remove", token);
				availableTokens[token].watched = false;
				if(watchTokens.includes(token)){
					watchTokens.splice(watchTokens.indexOf(token), 1);
				}
			}
			this.setState({ availableTokens: availableTokens });
		})
		this.setState({ selectedTokens: [] });

		// udpate the tokens in configuration file
		const castIronFields = ["datadir", "rpcAddr", "ipcPath", "defaultGasPrice", "gasOracleAPI",
			"condition", "networkID", "tokens", "watchTokens", "passVault"];
		let castIronWriter = ConfigWriterService.getFileWriter(path.join(this.cfgobj.configDir, "config.json"), castIronFields);

		//TODO: change it to use addKeyValue in future
		json.watchTokens = watchTokens;
		castIronWriter.writeJSON(json);
	}

	changeNewTokenField = (field, e) => {
		let tokenToAdd = this.state.tokenToAdd;
		if (field === "symbol") {
			tokenToAdd[field] = e.target.value;
		} else {
			tokenToAdd.token[field] = e.target.value;
		}

		this.setState({ tokenToAdd: tokenToAdd })
	}

	searchToken = () =>{
		if (this.state.tokenAction === "Search") {
			this.setState({ tokenAction: "" })
		} else {
			this.setState({ tokenAction: "Search" })
		}

	}



	handleChange = (tabName) => {
		this.setState({ currentSettings: tabName });
	}

	handleAccChange = (tabName) => {
		this.setState({ currentAccSettings: tabName });
	}

	render = () => {
		console.log("in settings render ...")
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
					<input type="button" className="button tabset" style=
						{{
							backgroundColor: this.state.currentSettings === 'tokens' ? "white" : "rgba(0,0,0,0)",
							color: this.state.currentSettings === 'tokens' ? "black" : "white"
						}} value="Tokens" onClick={this.handleChange.bind(this, "tokens")} />
				</legend>
				{
					this.state.waiting === false ?
						<div className="item SettingInner">
							{
								this.state.currentSettings === "gas" ? this.gasSettings()
									: this.state.currentSettings === "acc" ? this.accountMgr() :
										this.state.currentSettings === "tokens" ? this.tokensSettings() : this.setState({ currentSettings: 'gas' })
							}
						</div>
						: <div className="item SettingInner"><div className="waiter"><p style={{ fontSize: "26px" }}>Processing, please wait...</p><br /><div className="loader"></div></div></div>
				}
				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
			</fieldset>
		);
	}
}

export default Settings;
