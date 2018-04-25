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
  }

  handleChange = (event) => {
    CastIronActions.startUpdate(event.value, this.refs.canvas);
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
            </tr>
            <tr><td colSpan="2"><GenSheets /></td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default QueryForm
