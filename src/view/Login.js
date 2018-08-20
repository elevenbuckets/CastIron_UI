"use strict";

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import fs from 'fs';

// Reflux store
import CastIronStore from "../store/CastIronStore";

// Reflux action
import CastIronActions from '../action/CastIronActions';

// Singleton service
import AcctMgrService from "../service/AcctMgrService";
import CastIronService from "../service/CastIronService";

// Modals
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser';

// Views
import GenSheets from './GenSheets';

class Login extends AlertModalUser {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = {
      reveal: false,
      ptoggle: true,
      pfield: '28px',
      visible: false,
      sbutton: 'none'
    };

    this.wallet = CastIronService.wallet;
		this.accMgr = AcctMgrService.accMgr;
		this.variable = undefined;
  }

  handleClick = () => { this.toggleSettings(); }

  isCustomGasPriceValid = () => {
    return (this.state.gasPriceOption != "custom" || this.state.customGasPrice)
  }

  toggleSettings = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleChange = (event) => {
    CastIronActions.startUpdate(event.value, this.refs.canvas);
  }

  handleToggle = (event) => {
    let pt = !this.state.ptoggle;
    let sb = pt ? 'none' : 'inline-block';
    let pf = pt ? '100px' : '283px';
    this.setState({ ptoggle: pt, pfield: pf, sbutton: sb });
    CastIronActions.masterUpdate(this.refs.mp.value);
  }

  handleGasPriceSelect = (event) => {
    CastIronActions.gasPriceOptionSelect(event.currentTarget.defaultValue);
  }

  handleCustomGasPriceUpdate = (price) => {
    CastIronActions.customGasPriceUpdate(price);
  }

  handleEnter = (event) => {
	  if (event.keyCode === 13) CastIronActions.masterUpdate(this.refs.mp.value);
  }

  copyAddress = () => {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value=this.state.address;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  updateVar = (event) => {
		this.variable = event.target.value;
  }
  
  handleReveal = (event) => {
		this.setState({reveal: !this.state.reveal});
  }
  
  handleNewArch = (event) => {
		this.accMgr.newArchive(this.variable).then( () => { 
			this.variable = undefined; 
			this.openModal("New Archive created. You still needs to be unlocked to use it.");
		});
		// Should we update config.json with actual archive path, instead of pre-defined? 
		// Should we *also* update config.json to store custom gas price, if set?
	}

  render = () => {
    if (fs.existsSync(this.wallet.archfile) === false) {
			// create new buttercup archive using one time password input
			return (
				<div className="item list">
          <table style={{border: "2px solid white", backgroundColor: "rgba(255,255,255,0.11)"}}>
            <tbody>
              <tr>
                <td style={{ padding: "25px" }}>
                  <fieldset style=
                  {{
                    display: "inline-block", padding: "20px", textAlign: "center"
                  }}>
				            <legend style={{fontWeight: 'bold', marginBottom: '3px'}}>Please Enter New Master Password:</legend>
				              <input autoFocus type={this.state.reveal ? "text" : "password"} style={{
                        width: "250px", 
                        backgroundColor: "rgba(255,255,255,0.11)", 
                        border: "2px solid white",
                        fontSize: "24px",
                        color: "white",
                      }} onChange={this.updateVar}/>
                      <input type="button" className="button" value={this.state.reveal ? "Hide" : "Reveal"} style=
                      {{
                        fontSize: "22px",
                        margin: "0 10px 0 10px"
                      }} onClick={this.handleReveal} />
                      <input type="button" className="button" value="Set Master Password" style=
                      {{
                        fontSize: "22px"
                        
                      }} onClick={this.handleNewArch} />
			            </fieldset>
                  </td></tr>
            </tbody></table>
            <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>
				</div>
			       )
		} else {
      return (
        <div className="item list">
          <table style={{border: "2px solid white", backgroundColor: "rgba(255,255,255,0.11)"}}>
          <tbody>
            <tr>
              <td style={{ padding: "25px", color: 'red' }}>
                <label style={{ fontWeight: 'bold' }}>Master Password</label>
              </td></tr>
            <tr><td style={{textAlign: "center", margin: "25px"}}>
                <input autoFocus ref='mp' type='password' style=
                {{
                  width: "65%", 
                  marginBottom: '35px',
                  backgroundColor: "rgba(0,0,0,0.51)", 
                  border: "2px solid white",
                  fontSize: "24px",
                  color: "white",
                }} onKeyUp={this.handleEnter} />
              </td></tr>
          </tbody></table>
        </div>
      );
    }
  }
}

export default Login;