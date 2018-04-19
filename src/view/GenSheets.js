import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';

// Reflux components

class GenSheets extends Reflux.Component {
    constructor(props) {
      super(props);
      this.store = CastIronStore;
    }
  
    render = () => 
    {
      console.log("in render in Gensheets")
      if (this.state.address == '') return (<p/>);
  
      const balanceSheet = Object.keys(this.state.balances).map((b) =>
      { 
      if (b == 'ETH') {
      return (
      <tr key={b} className="balance-sheet">
            <td className="balance-sheet" width='185'>{b}:</td>
        <td className="balance-sheet">{this.state.balances[b]}</td>
        <td className="balance-sheet"><input type="button" className="button" value="send"/></td>
        <td className="balance-sheet"><input type="button" className="button" value="buy" disabled/></td>
        <td className="balance-sheet"><input type="button" className="button" value="sell" disabled/></td>
      </tr> );
      } else {
      return (
      <tr key={b} className="balance-sheet">
            <td className="balance-sheet" width='185'>{b}:</td>
        <td className="balance-sheet">{this.state.balances[b]}</td>
        <td className="balance-sheet"><input type="button" className="button" value="send"/></td>
        <td className="balance-sheet"><input type="button" className="button" value="buy"/></td>
        <td className="balance-sheet"><input type="button" className="button" value="sell"/></td>
      </tr> );
      }
      });
  
      return (
              <table className="balance-sheet">
              <tbody>
              <tr>
                <th className="balance-sheet">Types</th>
                <th className="balance-sheet">Amount</th>
                <th className="balance-sheet" colSpan="3">Actions</th>
              </tr>
              {console.log(balanceSheet)}
              {balanceSheet}
                  </tbody>
              </table>);
    }
  }

  export default GenSheets