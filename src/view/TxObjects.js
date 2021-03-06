"use strict";

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';

// Reflux store
import CastIronStore from "../store/CastIronStore";

// Modals
import AlertModalUser from '../common/AlertModalUser'
import AlertModal from '../components/AlertModal';

// Reflux components
class TxObjects extends AlertModalUser {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    // TODO: figure out why need this bind but Transfer.js does not 
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleChangeGas = this.handleChangeGas.bind(this);
    this.handleEnqueue = this.handleEnqueue.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChangeAmount(event) {
    console.log('got event: ' + event.target.value);

    let value = event.target.value;
    if (isNaN(value)) {
      this.openModal("Please enter a number!")
      event.target.value = value.slice(0, -1);
    } else {
      let amount = event.target.value;

      console.log('got amount: ' + amount);
      this.setState(() => { return { amount: amount } });
    }

  }

  handleChangeGas(event) {
    console.log('got event: ' + event.target.value);

    let value = event.target.value;
    if (isNaN(value)) {
      this.openModal("Please enter a number!")
      event.target.value = value.slice(0, -1);
    } else {
      let gas = event.target.value;
      console.log('got gas: ' + gas);
      this.setState(() => { return { gas: gas } });
    }
  }

  handleSend(event) {
    console.log("sending event" + event);
    let type = this.state.selected_token_name ? this.state.selected_token_name : "ETH";
    this.props.handleSend(this.props.recipient, type, this.state.amount, this.state.gas);
  }

  handleClick() {
    console.log("in handle click change token name function ....");
    if (this.state.address === null) return this.setState({selected_token_name: ''});

    let list = Object.keys(this.state.balances).sort().filter((i) => {if (this.state.balances[i] > 0) return i});

    if (list.length === 0) return this.setState({selected_token_name: ''});

    let symbol = this.state.selected_token_name === '' ? 'ETH' : this.state.selected_token_name;
    let index = list.indexOf(symbol);
    let ans = index === (list.length - 1) ? list[0] : list[index+1];
    this.setState({selected_token_name: ans});
  }

  handleEnqueue() {
    let tx = {};
    tx.from = this.state.address;
    tx.to = this.props.recipient;
    tx.amount = this.state.amount;
    tx.type = this.state.selected_token_name ? this.state.selected_token_name : "ETH";
    tx.gas = this.state.gas;
    this.props.handleEnqueue(tx);
  }


  render = () => {
    let sendkind = this.state.selected_token_name !== '' ? this.state.selected_token_name : 'ETH';

    return (
      <form className="item TxObj">
        <table>
          <tbody>
            <tr>
              <td width='14%' style={{ whiteSpace: 'nowrap' }}>
                Types<br /><div style=
                {{ 
                  textAlign: 'center', 
                  width: "3.5em", 
                  margin: "10px 0 0 15px", 
                  padding: "0px", 
                  border: "1px solid white",
                  cursor: "pointer"
                }} onClick={this.handleClick}>{sendkind}</div>
              </td>
              <td width='43%'>
                Amount<br /><div style={{ textAlign: 'center', marginTop: "10px" }}><input type='text' size='32' style=
                {{
                  backgroundColor: "rgba(255,255,255,0)",
                  border: "1px solid white",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "24px",
                  width: "200px",
                  textAlign: "right",
                  paddingRight: "12px"
                }} onChange={this.handleChangeAmount} /></div>
              </td>
              <td width='43%'>
                Gas<br /><div style={{ textAlign: 'center', marginTop: "10px" }}><input type='text' size='32' style=
                {{
                  backgroundColor: "rgba(255,255,255,0)",
                  border: "1px solid white",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "24px",
                  width: "200px",
                  textAlign: "right",
                  paddingRight: "12px"
                }} onChange={this.handleChangeGas} /></div>
              </td>
              <td><input type="button" className="button" value={this.props.send_button_value} onClick={this.handleSend} /></td>
              <td><input type="button" className="button" value='Enqueue' onClick={this.handleEnqueue} /></td>
            </tr>
          </tbody>
        </table>
        <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
      </form>
    );
  }
}

export default TxObjects;
