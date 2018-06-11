import Reflux from 'reflux';
import React from 'react';

import AlertModal from '../components/AlertModal';
import WaitModal from '../components/WaitModal';
import AlertModalUser from '../common/AlertModalUser'
import fs from 'fs';
import CastIronService from '../service/CastIronService';
import AcctMgrService from '../service/AcctMgrService';
import CastIronStore from '../store/CastIronStore';


class Settings extends AlertModalUser {
	constructor(props) {
		super(props);
		this.store = CastIronStore;

		this.state = {
			reveal: false,
			waiting: false,
			waitModalOpen: false,
		}

		this.wallet = CastIronService.wallet;
		this.accMgr = AcctMgrService.accMgr;
		this.variable = undefined;
	}

	handleCustomGasPriceUpdate = (event) =>{
		let value = event.target.value;
		if(isNaN(value)){
			this.openModal("Please enter a number!")
			 event.target.value = value.slice(0, -1);
		}else{
			this.props.handleCustomGasPriceUpdate(parseInt(event.target.value))
		}	
	}

	handleClickBack = () => {
		if(!this.props.isCustomGasPriceValid()){
			this.openModal("Please enter custom gas price!")
		  }else{
			this.props.handleClickBack();
		  }
	}

	handleNewArch = (event) => {
		this.accMgr.newArchive(this.variable).then( () => { 
			this.variable = undefined; 
			this.openModal("New Archive created. You still needs to be unlocked to use it.");
		});
		// Should we update config.json with actual archive path, instead of pre-defined? 
		// Should we *also* update config.json to store custom gas price, if set?
	}

	handleNewAcct = (event) => {
		let stage = Promise.resolve();
		stage
		  .then( () => { return this.setState({waiting: true}) })
		  .then( () => { this.updateNew(); } );
	}

	updateNew = () => {
		console.log("calling update now");
		return this.accMgr.newAccount(this.variable).then( (address) => { 
			this.variable = undefined; 
			this.refs.vip.value = '';
			this.setState({waiting: false});
			this.openModal("New Address: " + address);
		});
	}

	closeWaitModal = () => { this.setState({waitModalOpen: false}) };

	handleReveal = (event) => {
		this.setState({reveal: !this.state.reveal});
	}

	
	updateVar = (event) => {
		this.variable = event.target.value;
	}

	accountMgr = () => {
		if (fs.existsSync(this.wallet.archfile) === false) {
			// create new buttercup archive using one time password input
			return (
				<div>
			          <fieldset>
				    <legend>Please Enter New Master Password:</legend>
				      <input type={this.state.reveal ? "text" : "password"} onChange={this.updateVar}/>
				      <input type="button" value="Reveal Toggle" onClick={this.handleReveal} />
				      <input type="button" value="Set Master Password" onClick={this.handleNewArch} />
			          </fieldset>
				</div>
			       )
		}

		if (this.state.unlocked === false) {
			return (<p> Please Unlock Your Master Password First! </p>);
		} else {
			return (
				<div>
				  <fieldset>
				    <legend>Create New Account:</legend>
			              <p> Please Enter Password For New Account: </p>	
				      <input ref="vip" type={this.state.reveal ? "text" : "password"} onChange={this.updateVar}/>
				      <input type="button" value="Reveal Toggle" onClick={this.handleReveal} />
				      { this.state.waiting 
					      ? <div className="loader" style={{display: "inline-block"}}></div>
					      : <input type="button" value="Create" onClick={this.handleNewAcct} /> }
				  </fieldset>
				</div>
				)
		}
	}

	render = () => {
		let visibility = 'hide';
		if (this.props.visibility) visibility = 'show';

		return (
			<div id="settings"
				className={visibility}>
				<h2><a href="#">General</a></h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', marginLeft: "7%", marginRight: "10%", marginTop: '40px', marginBottom: '40px', textAlign: "center" }}>
					<table className="settings-sheet" border="0"><tbody>
						<form onSubmit={(e) =>{e.preventDefault()}} >
							<tr className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
								<td colSpan="5" className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.2em', fontWeight: "bold" }}>Gas Price: </label><br />
								</td>
							</tr>
							<tr className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)", marginLeft: "30px" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="low" />Slow</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="mid" />Mid</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="high" defaultChecked/>Normal</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="fast" />Fast</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="custom" />Custom
			<input type="text" style={{ marginLeft: '10px' }} name="custom_gasprice" 
			disabled={this.props.isCustomGasPrice} onChange={this.handleCustomGasPriceUpdate} placeholder="custom (in gwei)..." />
									</label>
								</td></tr>
						</form>
					</tbody></table>
				</div>
				<h2><a href="#">Accounts</a></h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', margin: '40px' }}>
				{ this.accountMgr() }
				</div>
				<h2><a href="#">Apps (coming soon!)</a></h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', margin: '40px' }}>this is where app menu is</div>
				<div style={{ margin: '60px', textAlign: "center" }}>
					<input type="button" className="button" onClick={this.handleClickBack} value="Back" />
				</div>

				
				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>

				
			</div>
		);
	}
}

export default Settings;
