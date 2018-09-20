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
    this.storeKeys = ['accounts', 'address', 'passManaged', 'lesDelay', 'balances', 'selected_token_name', 'tokenBalance']
  }

  handleChange = (event) => {
    CastIronActions.startUpdate(event.value, this.refs.canvas);
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
