import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';

// Reflux components

class TxQList extends Reflux.Component {
    constructor(props) {
      super(props);
      this.store = CastIronStore;
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
	     <div style={{overflow: 'auto', margin: '0'}} height='460px'>
              <table className="txform">
              <tbody>
              <tr>
                <td className="txform" width='6%'>X</td>
                <td className="txform" width='40%'>To</td>
                <td className="txform" width='20%'>Amount</td>
                <td className="txform" width='20%'>Gas Fee</td>
                <td className="txform">Actions</td>
              </tr>
              </tbody>
              </table>
	     </div>
      );
    }
  }

  export default TxQList
