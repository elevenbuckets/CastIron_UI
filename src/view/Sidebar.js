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

class Sidebar extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = {
      ptoggle: true,
      pfield: '28px',
      visible: false,
      sbutton: 'none',
      rtoggle: 'Receipts'
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

  handleLogout = () => {
    CastIronActions.masterUpdate('');
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

  // Questionable design.. Need reviews
  handleReceiptClick = () => {
    console.log("in handleReceiptClick");
    if (this.state.rtoggle === 'Receipts') {
      console.log(`switch from ${this.state.currentView} to Receipts`);
      this.setState({rtoggle: this.state.currentView});
      CastIronActions.changeView("Receipts");
    } else {
      console.log(`switch from Receipts back to previous view`);
      CastIronActions.changeView(this.state.rtoggle);
      this.setState({rtoggle: 'Receipts'});
    }
}

  render = () => {
    return (
      <div className="item action">
        <input type="button" className="button sbutton logout" value="Log Out" onClick={this.handleLogout}/>
        <input type="button" className="button sbutton settings" value="Settings" onClick=""/>
        <input type="button" className="button sbutton drawer" value="Apps" onClick=""/>
        <input type="button" className="button sbutton receipts" value={this.state.rtoggle} onClick={this.handleReceiptClick}/>
      </div>
    );
  }
}

export default Sidebar;