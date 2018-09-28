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
    this.state = {};
  }

  handleLogout = () => {
    CastIronActions.masterUpdate('');
  }

  handleDrawerClick = () => {
    console.log("in handleDrawerClick");
    if (this.props.previousView === '') {
      console.log(`switch from ${this.state.currentView} to AppView`);
      //this.setState({ sbefore: this.state.currentView, stoggle: true });
      this.props.updatePv(this.state.currentView)
      CastIronActions.changeView("AppView");
    } else {
      console.log(`switch from AppView back to previous view`);
      CastIronActions.changeView(this.props.previousView);
      this.props.updatePv('');
      //CastIronActions.changeView(this.state.sbefore);
      //this.setState({ stoggle: false, sbefore: 'Settings' });
    }
  }

  handleReceiptClick = () => {
    console.log("in handleReceiptClick");
    if (this.props.previousView === '') {
      console.log(`switch from ${this.state.currentView} to Receipts`);
      //this.setState({ sbefore: this.state.currentView, stoggle: true });
      this.props.updatePv(this.state.currentView)
      CastIronActions.changeView("Receipts");
    } else {
      console.log(`switch from Receipts back to previous view`);
      CastIronActions.changeView(this.props.previousView);
      this.props.updatePv('');
      //CastIronActions.changeView(this.state.sbefore);
      //this.setState({ stoggle: false, sbefore: 'Settings' });
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

  handleSettingClick = () => {
    console.log("in handleSettingClick");
    if (this.props.previousView === '') {
      console.log(`switch from ${this.state.currentView} to Settings`);
      //this.setState({ sbefore: this.state.currentView, stoggle: true });
      this.props.updatePv(this.state.currentView)
      CastIronActions.changeView("Settings");
    } else {
      console.log(`switch from Settings back to previous view`);
      CastIronActions.changeView(this.props.previousView);
      this.props.updatePv('');
      //this.setState({ stoggle: false, sbefore: 'Settings' });
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
        <input type="button" className="button sbutton logout" value="Log Out" style={{ display: this.props.previousView !== '' ? 'none' : true }} onClick={this.handleLogout} />
        <input type="button" className={this.props.previousView !== '' ? "button sbutton logout" : "button sbutton settings"} value={this.props.previousView !== '' ? 'Back' : 'Settings'} onClick={this.handleSettingClick} />
        <input type="button" className="button sbutton drawer" value="Apps" style={{ display: this.props.previousView !== '' ? 'none' : true }} onClick={this.handleDrawerClick} />
        <input type="button" className="button sbutton receipts" value='Receipts' style={{ display: this.props.previousView !== '' ? 'none' : true, animation: n > 0 ? "bgColor 1.1s infinite alternate" : "none" }} onClick={this.handleReceiptClick} />
      </div>
    );
  }
}

export default Sidebar;
