import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';

// Reflux components

class GenSheets extends Reflux.Component {
    constructor(props) {
      super(props);
      this.store = CastIronStore;
    }

    handleChange = (event) => {
      console.log("The state in GenSheets handleChange is " + event.value);
      let symbol = event.value.substring(0, event.value.indexOf(':'));
      this.setState( () => { return {selected_token_name: symbol}; } );
    }
  
    render = () => 
    {
      console.log("in render in Gensheets")
      console.log("selected_token_name: " + this.state.selected_token_name);
      if (this.state.address == '') return (<p/>);

      let tokenBalances = [];
      let tokenkinds = 0;
      this.state.tokenList.map((t) => 
		      {
				tokenBalances.push(t + ': ' + this.state.balances[t]);
				if (this.state.balances[t] > 0) tokenkinds++;
		      });

      return (
              <table className="balance-sheet">
              <tbody>
              <tr>
                <th className="balance-sheet">Types</th>
                <th className="balance-sheet">Amount</th>
                <th className="balance-sheet" colSpan="3">Actions</th>
              </tr>
              <tr className="balance-sheet">
                <td className="balance-sheet" width='185'>ETH:</td>
        	<td className="balance-sheet" width='35%'>{this.state.balances['ETH']}</td>
        	<td className="balance-sheet"><input type="button" className="button" value="Transact ETH"/></td>
        	<td className="balance-sheet"><input type="button" className="button" value="Trade ETH" disabled/></td>
      	      </tr>
      	      <tr className="balance-sheet">
                <td className="balance-sheet" width='185'>ERC20:</td>
                <td className="balance-sheet" width='35%'>
		<Dropdown options={ tokenBalances } onChange={this.handleChange} value={this.state.selected_token_name !== '' ? this.state.selected_token_name + ': ' + this.state.balances[this.state.selected_token_name] : ''} placeholder={'Found ' + tokenkinds + ' tokens'} />
		</td>
        	<td className="balance-sheet"><input type="button" className="button" value={this.state.selected_token_name !== '' ? "Transact " + this.state.selected_token_name : 'Transact ...'} /></td>
        	<td className="balance-sheet"><input type="button" className="button" value={this.state.selected_token_name !== '' ? "Trade " + this.state.selected_token_name : 'Trade ...'} /></td>
      	      </tr>
              </tbody>
              </table>);
    }
  }

  export default GenSheets
