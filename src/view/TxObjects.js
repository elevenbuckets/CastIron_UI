import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
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
    if (this.state.address == '') return (<p />);

    let sendkind = this.props.selected_token_name !== '' ? this.props.selected_token_name : 'ETH';

    return (
      <form>
        <table className="txform">
          <tbody>
            <tr className="txform">
              <td className="txform" width='14%' style={{ whiteSpace: 'nowrap' }}>
                Types<br /><div style={{ textAlign: 'right' }}>{sendkind}</div>
              </td>
              <td className="txform" width='43%'>
                Amount<br /><div style={{ textAlign: 'center' }}><input type='text' size='32' onChange={this.handleChangeAmount} /></div>
              </td>
              <td className="txform" width='43%'>
                Gas<br /><div style={{ textAlign: 'center' }}><input type='text' size='32' onChange={this.handleChangeGas} /></div>
              </td>
              <td className="txform" ><input type="button" className="button" value='Send' onClick={this.handleSend} /></td>
              <td className="txform"><input type="button" className="button" value='Enqueue' onClick={this.handleEnqueue} /></td>
            </tr>
          </tbody>
        </table>
        <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
      </form>
    );
  }
}

export default TxObjects;
