import Reflux from 'reflux';
import React from 'react';

import AlertModal from '../components/AlertModal';
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
			reveal2: false,
			waiting: false,
			dappList: [
				    'Scheduler',
				    'Eleven Peers',
				    'Mesh Eleven',
				    'My Profolios',
				    'Blood Line Registry',
				    'ENS bidding app',
				    'Club Badge',
				    '11BE Blog',
				    'Zombie Battles',
				    'Crypto Fighters'
				  ],
		}

		this.wallet = CastIronService.wallet;
		this.accMgr = AcctMgrService.accMgr;
		this.variable = undefined;
		this.keypath = undefined;
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
		  .then( () => { 
			  this.refs.fi.disabled = true;
			  this.refs.fa.disabled = true;
			  return this.setState({waiting: true}) 
		  })
		  .then( () => { this.updateNew(); } );
	}

	dappTable = () => {
		//react understand array
		return this.state.dappList.map((appName) => {
			return ( <tr className="balance-sheet">
			    <td className="balance-sheet" style={{width: "1000px"}}>{appName}</td>
			    <td className="balance-sheet" style={{width: "10%"}}>y</td>
			    <td className="balance-sheet" style={{width: "10%"}}>y</td>
			    <td className="balance-sheet" style={{width: "10%"}}>n</td>
			  </tr> )
		});
	}

	updateNew = () => {
		console.log("calling update now");
		return this.accMgr.newAccount(this.variable).then( (address) => { 
			this.variable = undefined; 
			this.refs.vip.value = '';
			this.setState({waiting: false});
			this.openModal("New Address: " + address);
			this.refs.fi.disabled = false;
			this.refs.fa.disabled = false;
		})
		.catch((err) => { 
			this.variable = undefined;
			this.refs.vip.value = '';
			this.setState({waiting: false});
			this.openModal("Creation Failed");
			this.refs.fi.disabled = false;
			this.refs.fa.disabled = false;
		});
	}

	handleReveal = (event) => {
		this.setState({reveal: !this.state.reveal});
	}

	handleReveal2 = (event) => {
		this.setState({reveal2: !this.state.reveal2});
	}

	handleImport = (event) => {
		console.log("Importing " + this.keypath);
		this.setState({waiting: true});
		this.refs.fi.disabled = true;
		this.refs.fa.disabled = true;
		this.accMgr.importFromJSON(this.keypath, this.variable).then( (r) => {
			this.accMgr.update(r.keyObj, r.password).then( (address) => {
				r = {};
				this.refs.vif.value = '';
				this.keypath = undefined;
				this.refs.vop.value = '';
				this.variable = undefined;
				this.setState({waiting: false});
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
			this.setState({waiting: false});
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

	handleHover = (enter) => {
		if (enter === 'fa') {
			this.refs.fa.disabled = false;
			this.refs.fi.disabled = true;
		} else if (enter === 'fi') {
			this.refs.fi.disabled = false;
			this.refs.fa.disabled = true;
		}
	}

	handleNoHover(left) {
		if (left === 'fa' && this.refs.fi.disabled) {
		       this.refs.fi.disabled = false;
	        } else if (left === 'fi' && this.refs.fa.disabled) {
		       this.refs.fa.disabled = false;
	 	}		
	}

	accountMgr = () => {
		if (fs.existsSync(this.wallet.archfile) === false) {
			// create new buttercup archive using one time password input
			return (
				<div style={{align: 'center'}}>
			          <fieldset style={{display: 'inline-block', marginLeft: '32%', padding: '20px'}}>
				    <legend style={{fontWeight: 'bold', marginBottom: '3px'}}>Please Enter New Master Password:</legend>
				      <input type={this.state.reveal ? "text" : "password"} onChange={this.updateVar}/>
				      <input type="button" value={this.state.reveal ? "Hide" : "Reveal"} onClick={this.handleReveal} />
				      <input type="button" value="Set Master Password" onClick={this.handleNewArch} />
			          </fieldset>
				</div>
			       )
		}

		if (this.state.unlocked === false) {
			return (<p style={{fontSize: '1.5em', height: '102px', textAlign: 'center'}}> Please Unlock Your Master Password First! </p>);
		} else {
			return (
				<div style={{align: 'center'}}>
				  <fieldset ref="fa" id="fa" onMouseEnter={this.handleHover.bind(this,'fa')} onMouseLeave={this.handleNoHover.bind(this, 'fa')}
				         style={{display: 'inline-block', marginLeft: '130px', padding: '20px'}}>
				    <legend style={{fontWeight: 'bold', marginBottom: '3px'}}>Create New Account:</legend>
			              Please Enter Password For New Account:<br/>
				      <input ref="vip" style={{marginLeft: '6px'}} type={this.state.reveal ? "text" : "password"} onChange={this.updateVar}/>
				      <input type="button" style={{marginRight: '6px'}} value={this.state.reveal ? "Hide" : "Reveal"} onClick={this.handleReveal} />
				      { this.state.waiting 
					      ? <div className="loader" style={{height: '13px', width: '13px', display: "inline-block"}}></div>
					      : <input type="button" value="Create" onClick={this.handleNewAcct} /> }
				  </fieldset>
				  <fieldset ref="fi" id="fi" onMouseEnter={this.handleHover.bind(this, 'fi')} onMouseLeave={this.handleNoHover.bind(this, 'fi')}
				         style={{display: 'inline-block', padding: '20px'}}>
				    <legend style={{fontWeight: 'bold'}}>Import Account:</legend>
				      Please Select File:
				      <input ref="vif" style={{marginLeft: '6px'}} type='file' onChange={this.updatePath}/><br/>
			              Please Enter Password Of The Account:
				      <input ref="vop" style={{marginLeft: '6px'}} type={this.state.reveal2 ? "text" : "password"} onChange={this.updateVar}/>
				      <input type="button" style={{marginRight: '6px'}} value={this.state.reveal2 ? "Hide" : "Reveal"} onClick={this.handleReveal2} />
				      { this.state.waiting 
					      ? <div className="loader" style={{height: '13px', width: '13px', display: "inline-block"}}></div>
					      : <input type="button" value="Create" onClick={this.handleImport} /> }
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
				<h2><a style={{display: 'inline'}} href="#">General</a>
				    <p style={{display: 'inline', margin: "0 0 0 71%"}}>{"Network ID: " + this.wallet.networkID}</p>
				</h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', marginLeft: "7%", marginRight: "10%", marginTop: '40px', marginBottom: '40px', textAlign: "center" }}>
					<table className="settings-sheet" border="0"><tbody>
						<form style={{textAlign: 'center'}} onSubmit={(e) =>{e.preventDefault()}} >
						    <fieldset style={{marginLeft: "7.5%", padding: "5px 25px 5px 25px", width: "83%", textAlign: "center"}}>
							<legend style={{textAlign: 'left', fontWeight: "bold" }}>Gas Price: </legend>
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
						   </fieldset>
						</form>
					</tbody></table>
				</div>
				<h2><a href="#">Accounts</a></h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', margin: '40px' }}>
				{ this.accountMgr() }
				</div>
                    {	/*				
				<h2><a href="#">Applications</a></h2><hr color='#333' width='90%' />
				  <table border="1" className="appList"><tbody style={{display: 'block', height: '340px', overflow: "hidden"}}>
					  <tr>
					    <td style={{width: "1000px"}}>App Name</td>
					    <td style={{width: "10%"}}>installed</td>
					    <td style={{width: "10%"}}>drawer</td>
					    <td style={{width: "10%"}}>launch</td>
					    <td style={{width: "2px", padding: "0px", border: "0px", color: "black"}}>.</td>
					  </tr>
					  <table><tbody style={{display: 'block', height: '300px', overflow: "scroll"}}>
					  { this.dappTable() }
					  </tbody></table>
				    </tbody></table>
		     */   }
				<div style={{ margin: '150px', textAlign: "center" }}>
					<input type="button" className="button" onClick={this.handleClickBack} value="Back" />
				</div>

				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>
			</div>
		);
	}
}

export default Settings;
