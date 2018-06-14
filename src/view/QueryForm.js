import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import GenSheets from './GenSheets'
import Settings from './Settings'
import CastIronActions from '../action/CastIronActions'

class QueryForm extends Reflux.Component {
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


  handleClick = () => {

    this.toggleSettings();

    console.log("clicked");
  }

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
      <div>
        <Settings handleClickBack={this.handleClick} isCustomGasPrice={this.state.gasPriceOption != "custom"}
          visibility={this.state.visible} isCustomGasPriceValid={this.isCustomGasPriceValid}
          handleGasPriceSelect={this.handleGasPriceSelect} handleCustomGasPriceUpdate={this.handleCustomGasPriceUpdate} />
        <table>
          <tbody>
            <tr>
              <td className="avatar" width={201}>
                <canvas ref='canvas' width={66} height={66} style=
                  {
                    {
                      border: "3px solid #ccc",
                      borderBottomLeftRadius: "2.8em",
                      borderBottomRightRadius: "2.8em",
                      borderTopRightRadius: "2.8em",
                      borderTopLeftRadius: "2.8em"
                    }
                  }
                /></td>
              <td style={{padding: "0px 25px 0px 45px", margin: "0px"}}>
                <table border="0"><tbody><tr style={{ border: '0px'}} align="center">
                  <td style={{ border: '0px', padding: '0px', width: '10px'}}>
                    <p style={{fontWeight: 'bold', fontSize: "1.2em", display: "inline-block", margin: "0px", padding: "0px", width: "80px"}}>Address:</p></td>
		  <td rowSpan='2' style={{ border: '0px', padding: '0px'}}>
	            <Dropdown ref='addrlist' id="mainaddr" options={Object.keys(this.state.accounts)} onChange={this.handleChange} 
		            value={this.state.address} placeholder="Select an option" />
                  </td></tr>
		  <tr style={{ border: '0px' }} align="center">
		  <td style={{ border: '0px', padding: '0px', width: '110px'}}>
                    <input style={{display: 'inline-block', padding: '2px', margin: '0px', color: '#ffffff', borderColor: '#ffffff'}} 
		            type="button" className="bbutton" value='Copy' onClick={this.copyAddress} />
		  </td>
                  </tr>
                </tbody></table>

              </td>
              <td width={this.state.pfield} style={{ textAlign: 'center', minWidth: this.state.pfield }}
                onMouseEnter={this.handleToggle} onMouseLeave={this.handleToggle}>
                <table border="0"><tbody><tr style={{ border: '0px' }} align="center"><td style={{ border: '0px', color: this.state.unlocked ? '#4CAF50' : 'red' }}>
                  <label style={{ fontWeight: 'bold' }}>Master Password</label><br />
                  <input ref='mp' type='password' maxLength='200' hidden={this.state.ptoggle} style={{ marginTop: '7px' }} />
                </td>
                  <td style={{ border: '0px', display: this.state.sbutton, textAlign: "center" }}>
                    <input type="button" className="button" onClick={this.handleClick} style={{ marginTop: '7px' }} value="Settings" />
                  </td></tr>
                </tbody></table>
              </td>
            </tr>
            <tr><td colSpan="3"><GenSheets /></td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default QueryForm
