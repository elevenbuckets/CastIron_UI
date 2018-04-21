import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';

// Reflux components

class TxObjects extends Reflux.Component {
    constructor(props) {
      super(props);
      this.store = CastIronStore;
    }

    render = () => 
    {
      console.log("in render in TxObjects")
      console.log("selected address:" + this.state.address);
      console.log("selected_token_name in TxObjects: " + this.props.selected_token_name);
      if (this.state.address == '') return (<p/>);

      let sendkind = this.props.selected_token_name !== '' ? this.props.selected_token_name : 'ETH'; 

      return (
	      <form>
              <table className="txform">
              <tbody>
              <tr className="txform">
                <td className="txform" width='14%' style={{whiteSpace: 'nowrap'}}>
		  Types<br/><div style={{textAlign: 'right'}}>{sendkind}</div>
		</td>
                <td className="txform" width='43%'>
		  Amount<br/><div style={{textAlign: 'center'}}><input type='text' size='32'/></div>
		</td>
                <td className="txform" width='43%'>
		  Gas<br/><div style={{textAlign: 'center'}}><input type='text' size='32'/></div>
		</td>
              </tr>
              </tbody>
              </table>
	      </form>
	);
    }
  }

  export default TxObjects;
