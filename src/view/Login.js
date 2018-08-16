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

class Login extends Reflux.Component {
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
      <div className="item list">
        <table style={{border: "2px solid white", backgroundColor: "rgba(255,255,255,0.11)"}}>
        <tbody>
          <tr>
            <td style={{ padding: "25px", color: 'red' }}>
              <label style={{ fontWeight: 'bold' }}>Master Password</label>
            </td></tr>
          <tr><td style={{textAlign: "center", margin: "25px"}}>
              <input ref='mp' type='password' style={{width: "65%", marginBottom: '35px' }} onKeyUp={this.handleEnter} />
            </td></tr>
        </tbody></table>
      </div>
    );
  }
}

export default Login;