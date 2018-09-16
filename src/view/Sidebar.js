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

// Utils
import Constants from '../util/Constants';

class Sidebar extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = {
      ptoggle: true,
      pfield: '28px',
      visible: false,
      sbutton: 'none',
      rtoggle: 'Receipts',
      stoggle: false,
      sbefore: 'Settings'
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

  handleDrawerClick = () => {
    console.log("in handleDrawerClick");
    if (this.state.stoggle === false) {
      console.log(`switch from ${this.state.currentView} to AppView`);
      this.setState({ sbefore: this.state.currentView, stoggle: true });
      CastIronActions.changeView("AppView");
    } else {
      console.log(`switch from AppView back to previous view`);
      CastIronActions.changeView(this.state.sbefore);
      this.setState({ stoggle: false, sbefore: 'Settings' });
    }
  }

  copyAddress = () => {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value = this.state.address;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  // Questionable design.. Need reviews
  handleReceiptClick = () => {
    console.log("in handleReceiptClick");
    if (this.state.rtoggle === 'Receipts') {
      console.log(`switch from ${this.state.currentView} to Receipts`);
      this.setState({ rtoggle: this.state.currentView });
      CastIronActions.changeView("Receipts");
    } else {
      console.log(`switch from Receipts back to previous view`);
      CastIronActions.changeView(this.state.rtoggle);
      this.setState({ rtoggle: 'Receipts' });
    }
  }

  handleSettingClick = () => {
    console.log("in handleSettingClick");
    if (this.state.stoggle === false) {
      console.log(`switch from ${this.state.currentView} to Settings`);
      this.setState({ sbefore: this.state.currentView, stoggle: true });
      CastIronActions.changeView("Settings");
    } else {
      console.log(`switch from Settings back to previous view`);
      CastIronActions.changeView(this.state.sbefore);
      this.setState({ stoggle: false, sbefore: 'Settings' });
    }
  }

  hasPendingReceipt = (receipts) => {
    for (let i in receipts) {
      if (this.getStatus(receipts[i]) == Constants.Pending) {
        return true;
      }
    }
    return false;
  }

  getStatus = (receipt) => {
    if (receipt.status === "0x0") {
      return Constants.Failed;
    } else if (receipt.status === "0x1") {
      return Constants.Succeeded;
    } else if (receipt.error) {
      return Constants.Errored;
    }
    return Constants.Pending;
  }

  hasNumberOfPendingReceipts = () => {
    let pendingQs = Object.keys(this.state.receipts).filter(Q => {
        return this.state.receipts[Q] && this.state.receipts[Q].length > 0 && this.hasPendingReceipt(this.state.receipts[Q])
    })

    return pendingQs.length;
  }

  render = () => {
    let n = this.hasNumberOfPendingReceipts();

    return (
      <div className="item action">
        <input type="button" className="button sbutton logout" value="Log Out" style={{ display: this.state.stoggle ? 'none' : true }} onClick={this.handleLogout} />
        <input type="button" className={this.state.stoggle ? "button sbutton logout" : "button sbutton settings"} value={this.state.stoggle ? 'Back' : 'Settings'} onClick={this.handleSettingClick} />
        <input type="button" className="button sbutton drawer" value="Apps" style={{ display: this.state.stoggle ? 'none' : true }} onClick={this.handleDrawerClick} />
        <input type="button" className="button sbutton receipts" value={this.state.rtoggle} style={{ display: this.state.stoggle ? 'none' : true, animation: n > 0 ? "bgColor 1.1s infinite alternate" : "none" }} onClick={this.handleReceiptClick} />
      </div>
    );
  }
}

export default Sidebar;
