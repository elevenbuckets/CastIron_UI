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
              <td width='34%'>From</td>
              <td width='34%'>To</td>
              <td width='6%'>Type</td>
              <td width='11%'>Amount</td>
              <td width='12%'>Gas Fee</td>
            </tr>
            {this.state.queuedTxs.map((tx) => {
              return (
                <tr>
                  <td style={{maxWidth: '12px'}}><input type="button" className="button xbutton" value='X'
                    onClick={this.handleDequeue.bind(this, tx)} /></td>
                  <td width='34%'>{tx.from}</td>
                  <td width='34%'>{tx.to}</td>
                  <td width='6%' >{tx.type}</td>
                  <td width='11%'>{tx.amount}</td>
                  <td width='12%'>{this.props.toEther(tx.gas * this.state.gasPrice)}</td>
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
