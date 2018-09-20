"use strict";

// Third-parties
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';

// Reflux store
import CastIronStore from "../store/CastIronStore";

// Reflux action
import CastIronActions from '../action/CastIronActions';

// Modals
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser';

// Singleton services
import CastIronService from '../service/CastIronService';

// Reflux components and Alert Modal user
class GenSheets extends AlertModalUser {
  constructor(props) {
    super(props);
    this.store = CastIronStore;

    this.state = {
      tokenBalances: [],
      tokenkinds: 0
    }

    this.storeKeys = ['passManaged', 'address', 'tokenBalance', 'lesDelay', 'selected_token_name', 'balances', 'isAlertModalOpen', 'alertContent']
  }


  componentDidUpdate(prevProps, prevState) {

    if (this.state.address != prevState.address && this.state.tokenBalance.length == 0) {
	    CastIronActions.selectedTokenUpdate('');
    }
    /*
    let tokenBalances = [];
    let tokenkinds = 0;


    if (this.state.address != prevState.address && this.state.address != '') {
      this.state.tokenList.map((t) => {
        tokenBalances.push(t + ': ' + this.state.balances[t]);
        if (this.state.balances[t] > 0) tokenkinds++;
      });
    
      this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
    }
    */
  }

  handleChange = (event) => {
    console.log("event.value in GenSheets handleChange is " + event.value);
    let symbol = event.value.substring(0, event.value.indexOf(':'));
    console.log("Symbol in GenSheets handleChange is " + symbol);
    if (symbol != this.state.selected_token_name) CastIronActions.selectedTokenUpdate(symbol);
  }

  // Should NOT change the original array content
  // only works with set (an array with no repeated element)
  ArrayRest = (array, element) => {
	let ans = [...array];
	ans.splice(array.indexOf(element),1);
	return ans;
  }

  render = () => {
    return (
      <div className="quickbalance">
          <div className="item teth"><p>ETHER</p></div>
          <div className="item beth">
           { this.state.lesDelay === true 
            ? <p style={{color: "white", fontSize: "22px"}}><span className="dot dotOne">-</span><span className="dot dotTwo">-</span><span className="dot dotThree">-</span></p> 
            : <p style={{color: "white", fontSize: "22px"}}>{this.state.balances['ETH']}</p> }
          </div>
          <div className="item terc20">
            <Dropdown 
	    options={ this.state.selected_token_name != '' 
		? this.ArrayRest(this.state.tokenBalance, `${this.state.selected_token_name}: ${this.state.balances[this.state.selected_token_name]}`) 
	        : this.state.tokenBalance } onChange={this.handleChange} value={this.state.selected_token_name} placeholder='ERC20'/>
	  </div>
	  <div className="item berc20">
          { this.state.lesDelay === true
            ? <p style={{fontSize: "22px"}}><span className="dot dotOne">-</span><span className="dot dotTwo">-</span><span className="dot dotThree">-</span></p>
            : <p style={{fontSize: '22px'}}>{ this.state.selected_token_name !== '' ? this.state.balances[this.state.selected_token_name] : this.state.tokenBalance.length }</p>
          }
	  </div>
            
          <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
      </div>
    );
  }
}

export default GenSheets;
