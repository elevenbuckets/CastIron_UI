"use strict";

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';

// Reflux store
import CastIronStore from "../store/CastIronStore";

// Reflux action
import CastIronActions from '../action/CastIronActions';

// Views
import GenSheets from './GenSheets';

class Accounts extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = {
      ptoggle: true,
      pfield: '28px',
      visible: false,
      sbutton: 'none'
    };
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

  render = () => {
    return (
      <div className="address">
           <canvas className="avatar" ref='canvas' width="90px" height="90px" style={ 
		this.state.address in this.state.passManaged ? this.state.passManaged[this.state.address] === true ? {border: '4px solid rgba(255,255,255,0.73)'} : {border: '4px solid rgba(255,0,0,0.73)'} : {border: '4px solid rgba(255,255,255,0.73)'}
	   } />
           <Dropdown className="dropdown" options={this.state.accounts} style={{fontSize:"16px", width: "100%"}} 
                onChange={this.handleChange} value={this.state.address} 
                placeholder={"You Have " + this.state.accounts.length + " Accounts"} />
           <input type="image" src="./assets/copy.png" className="button copyAddr" style=
           {{
              border: "0px"
           }} value="" onClick={this.copyAddress} />
         <GenSheets />
      </div>
    );
  }
}

export default Accounts;
