import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import CastIronActions from "../action/CastIronActions";

// Reflux components

class TxQList extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
  }


  handleDequeue(tx, event) {
    CastIronActions.dequeue(tx);
  }

  handSendTxInQueue(tx, event) {
    CastIronActions.sendTxInQueue(tx);
    event.target.blur();
  }

  render = () => {
    if (this.state.address == '') return (<p className="item TQList" />);

    let tokenBalances = [];
    let tokenkinds = 0;
    this.state.tokenList.map((t) => {
      tokenBalances.push(t + ': ' + this.state.balances[t]);
      if (this.state.balances[t] > 0) tokenkinds++;
    });

    return (
      <div className="TQList">
        <table style={{width: "100%"}}>
          <tbody>
            <tr>
              <td width='3%'>X</td>
              <td width='32%'>From</td>
              <td width='32%'>To</td>
              <td width='4%'>Type</td>
              <td width='10%'>Amount</td>
              <td width='10%'>Gas Fee</td>
              <td>Actions</td>
            </tr>
            {this.state.queuedTxs.map((tx) => {
              return (
                <tr>
                  <td width='5%'><input type="button" className="button xbutton" value='X'
                    onClick={this.handleDequeue.bind(this, tx)} /></td>
                  <td width='32%'>{tx.from}</td>
                  <td width='32%'>{tx.to}</td>
                  <td width='4%' >{tx.type}</td>
                  <td width='10%'>{tx.amount}</td>
                  <td width='10%'>{tx.gas * this.state.gasPrice}</td>
                  <td><input type="button" className="button sendbutton" value='Send'
                    onClick={this.handSendTxInQueue.bind(this, tx)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TxQList
