import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import CastIronActions from '../action/CastIronActions';
import TxObjects from './TxObjects';
import { createCanvasWithAddress } from "../util/Utils";

class Transfer extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = {recipient: ''};
    this.wallet = CastIronService.wallet;
    this.timeout;
  }

  handleChange = (event) => {
//    clearTimeout(this.timeout);
    console.log('got event: ' + event.target.value);
    let addr = event.target.value;
    console.log('got addr: ' + addr);
    createCanvasWithAddress(this.refs.canvas, addr);

//    this.timeout = setTimeout( () => 
//    {
      this.setState(() => { return {recipient: addr}});
//    }, 550);


  }

  render = () => {
    console.log("The state in render is " + JSON.stringify(this.state));
    return (
      <div>
        <table className="balance-sheet">
          <tbody>
	    <tr className="avatar" style={{textAlign: "center"}}>
		<th colSpan="2" className="avatar" style={{textAlign: "center"}}>Transfer</th>
	    </tr>
            <tr className="balance-sheet">
              <td className="balance-sheet">
                <label>
                  Recipient:
	     <input size={84} style={{marginLeft: '30', fontFamily: 'monospace', fontSize: '1.09em'}} type='text' onChange={this.handleChange} value={this.state.recipient} placeholder="Ethereum Address" />
                </label>
              </td>
              <td className="balance-sheet" width={201} rowSpan='2'>
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
            </tr>
            <tr className="balance-sheet">
		<td className="balance-sheet">
			<TxObjects selected_token_name={this.state.selected_token_name}/>
		</td>
	    </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Transfer
