"use strict";

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';

// Reflux store
import CastIronStore from "../store/CastIronStore";

// Reflux action
import CastIronActions from '../action/CastIronActions';

// Singleton service
import CastIronService from "../service/CastIronService";

// Views
import TxObjects from './TxObjects';
import TxQList from './TxQList';

// Utils
import { createCanvasWithAddress } from "../util/Utils";

class Transfer extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = { recipient: '' };
    this.wallet = CastIronService.wallet;
    this.timeout;
  }

  handleEnqueue = (tx) => { CastIronActions.enqueue(tx); }
  handleDequeue = (tx) => { CastIronActions.dequeue(tx); }
  handleClearQueue = () => { CastIronActions.clearQueue(); }
  handleBatchSend() { CastIronActions.batchSend(); }
  handleSend = (addr, type, amount, gasNumber) => {
    CastIronActions.send(this.state.address, addr, type, amount, gasNumber);
  }

  handleChange = (event) => {
    let addr = event.target.value;
    console.log('got addr: ' + addr);
    try {
      if ( 
        CastIronService.wallet.web3.isAddress(addr) === true
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
      <div className="item TransferLayout">
        <label className="item TransferTo">
          Recipient:
          <input size={62} type='text' style=
          {{
            marginLeft: "40px",
            backgroundColor: "rgba(255,255,255,0)",
            border: "1px solid white",
            color: "white",
            fontWeight: "bold",
            fontSize: "24px",
            fontFamily: "monospace",
	    textAlign: "center"
          }} onChange={this.handleChange} 
                value={this.state.recipient} placeholder="Ethereum Address" />
        </label>

        <canvas className="item ToAvatar" ref='canvas' width="96%" height="96%" style=
            {
              {
                border: "4px solid rgba(255,255,255,0.73)",
                borderRadius: "25em"
              }
            }
        />
        <TxObjects selected_token_name={this.state.selected_token_name} send_button_value="Send"
          handleEnqueue={this.handleEnqueue} handleSend={this.handleSend} recipient={this.state.recipient}/>
        <TxQList />
        <div className="item TransferClicks">
          <input type="button" className="button" value='BatchSend' onClick={this.handleBatchSend} />
          <input type="button" className="button xbutton" value='ClearAll' onClick={this.handleClearQueue} />
        </div>
      </div>
    );
  }
}

export default Transfer;
