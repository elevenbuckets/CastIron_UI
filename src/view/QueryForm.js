import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import GenSheets from './GenSheets'
import CastIronActions from '../action/CastIronActions'

class QueryForm extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = {
	    ptoggle: true, 
	    pfield: '28px'
    };
  }

  handleChange = (event) => {
    CastIronActions.startUpdate(event.value, this.refs.canvas);
  }

  handleToggle = (event) => {
    let pt = !this.state.ptoggle;
    let pf = pt ? '100px' : '283px';
    this.setState({ptoggle: pt, pfield: pf});
    CastIronActions.masterUpdate(this.refs.mp.value);
  }

  render = () => {
    return (
      <div>
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
              <td>
                <label>
                  Address:
	     <Dropdown ref='addrlist' options={Object.keys(this.state.accounts)} onChange={this.handleChange} value={this.state.address} placeholder="Select an option" />
                </label>
              </td>
	      <td width={this.state.pfield} style={{textAlign: 'center', minWidth:this.state.pfield }} onMouseEnter={this.handleToggle} onMouseLeave={this.handleToggle}>
	         Master Password <br/>
	      <input ref='mp' type='password' maxLength='200' hidden={this.state.ptoggle} style={{marginTop: '7px'}}/>
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
