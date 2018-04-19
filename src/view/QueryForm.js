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
    console.log("The state at constructor is : " + JSON.stringify(this.state));
    setTimeout(error => (console.log("The state at constructor 1s later is : " + JSON.stringify(this.state))), 1000)
  }

  handleChange = (event) => {
    console.log("The state in handleChange is " + JSON.stringify(this.state));
    CastIronActions.startUpdate(event.value, this.refs.canvas);
  }

  render = () => {
    console.log("The state in render is " + JSON.stringify(this.state));
    return (
      <div>
        {console.log("The state in jsx is " + JSON.stringify(this.state))}
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
            </tr>
            <tr><td colSpan="2"><GenSheets /></td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default QueryForm
