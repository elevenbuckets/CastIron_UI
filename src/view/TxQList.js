import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';

// Reflux components

class TxQList extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
  }

  render = () => {
    console.log("in render in Gensheets")
    console.log("selected_token_name: " + this.state.selected_token_name);
    if (this.state.address == '') return (<p />);

    let tokenBalances = [];
    let tokenkinds = 0;
    this.state.tokenList.map((t) => {
      tokenBalances.push(t + ': ' + this.state.balances[t]);
      if (this.state.balances[t] > 0) tokenkinds++;
    });

    return (
      <div style={{ overflow: 'auto', margin: '0' }} height='460px'>
        <table className="txform">
          <tbody>
            <tr>
              <td className="txform" width='3%'>X</td>
              <td className="txform" width='32%'>From</td>
              <td className="txform" width='32%'>To</td>
              <td className="txform" width='12%'>Amount</td>
              <td className="txform" width='12%'>Gas Fee</td>
              <td className="txform">Actions</td>
            </tr>
            {this.state.queuedTxs.map((tx) => {
              return (
                <tr>
                  <td className="txform" width='5%'><input type="button" className="xbutton" value='X' /></td>
                  <td className="txform" width='32%'>{tx.from}</td>
                  <td className="txform" width='32%'>{tx.to}</td>
                  <td className="txform" width='12%'>{tx.amount}</td>
                  <td className="txform" width='12%'>{tx.gas}</td>
                  <td className="txform"><input type="button" className="button" value='Send' /></td>
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
