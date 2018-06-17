import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import CastIronActions from '../action/CastIronActions';
import TxObjects from './TxObjects';
import TxQList from './TxQList';
import { createCanvasWithAddress } from "../util/Utils";

class Transfer extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = { recipient: '' };
    this.wallet = CastIronService.wallet;
    this.timeout;
  }

  handleEnqueue(tx) {
    CastIronActions.enqueue(tx);
  }

  handleDequeue(tx) {
    CastIronActions.dequeue(tx);
  }

  handleClearQueue() {
    CastIronActions.clearQueue();
  }


  handleSend(addr, type, amount, gasNumber) {
    CastIronActions.send(addr, type, amount, gasNumber);
  }

  handleBatchSend() {
    CastIronActions.batchSend();
  }


  handleChange = (event) => {
    let addr = event.target.value;
    console.log('got addr: ' + addr);
    try {
      if ( CastIronService.wallet.web3.isAddress(addr) === true
	   && (CastIronService.wallet.web3.toAddress(addr) == addr || CastIronService.wallet.web3.toChecksumAddress(addr) == addr)
      ) {
	addr = CastIronService.wallet.web3.toAddress(addr);
        createCanvasWithAddress(this.refs.canvas, addr);
      } else {
        this.refs.canvas.getContext('2d').clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
      }
    } catch (err) {
      this.refs.canvas.getContext('2d').clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    }

    this.setState(() => { return { recipient: addr } });
  }

  render = () => {
    return (
      <div>
        <table className="balance-sheet">
          <tbody>
            <tr className="avatar" style={{ textAlign: "center" }}>
              <th colSpan="2" className="avatar" style={{ textAlign: "center" }}>Transfer</th>
            </tr>
            <tr className="balance-sheet">
              <td className="balance-sheet">
                <label>
                  Recipient:
       <input size={62} style={{ marginLeft: '30', fontFamily: 'monospace', fontSize: '1.09em' }} type='text'
                    onChange={this.handleChange} value={this.state.recipient} placeholder="Ethereum Address" />
                </label>
              </td>
              <td className="balance-sheet" width={211} rowSpan='2' style={{ backgroundColor: '#eeeeee' }}>
                <table className="txform"><tbody><tr className="txform"><td className="txform" style={{ textAlign: 'center' }}>
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
                  /></td></tr></tbody></table>
              </td>
            </tr>
            <tr className="balance-sheet">
              <td className="balance-sheet">
                <TxObjects selected_token_name={this.state.selected_token_name}
                  handleEnqueue={this.handleEnqueue} handleSend={this.handleSend}
                  recipient={this.state.recipient} send_button_value="Send"/>
              </td>
            </tr>
          </tbody>
        </table>
        <TxQList style={{ marginTop: '0', marginBottom: '0', paddingTop: '0', paddingBottom: '0' }} />
        <div style=
          {
            {
              textAlign: 'center',
              backgroundColor: '#ffffff',
              width: '100%',
              maxHeight: '46',
              minHeight: '46',
              zIndex: '1',
              position: "fixed",
              bottom: '20%',
              boxShadow: '0 -5px 6px -5px rgba(200,200,200,0.5)'
            }
          }>
          <input type="button" className="button" value='BatchSend' onClick={this.handleBatchSend} style={{ width: '160px', marginTop: '5px', marginLeft: '5%', marginRight: '5%' }} />
          <input type="button" className="button" value='ClearAll' onClick={this.handleClearQueue} style={{ backgroundColor: 'rgb(250,0,0)', width: '160px', marginTop: '5px', marginLeft: '5%', marginRight: '5%' }} />
        </div>
      </div>
    );
  }
}

export default Transfer
