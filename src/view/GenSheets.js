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
import BMartService from '../service/BMartService';

// Reflux components and Alert Modal user
class GenSheets extends AlertModalUser {
  constructor(props) {
    super(props);
    this.store = CastIronStore;

    this.state = {
      tokenBalances: [],
      tokenkinds: 0
    }

    this.rootViews = {'Transfer': true, 'Scheduler': true};
  }


  componentDidUpdate(prevProps, prevState) {
    let tokenBalances = [];
    let tokenkinds = 0;

    if (this.state.address != prevState.address && this.state.address != '') {
      this.state.tokenList.map((t) => {
        tokenBalances.push(t + ': ' + this.state.balances[t]);
        if (this.state.balances[t] > 0) tokenkinds++;
      });

      if (this.state.currentView == 'Trade') {
      tokenBalances = tokenBalances.filter((line) => {
        let symbol = line.substring(0, line.indexOf(':'));
        return BMartService.Registry.isListed(CastIronService.wallet.TokenList[symbol].addr);
      })
      }
    }

    if (this.state.currentView != prevState.currentView && this.state.currentView == 'Trade') {
      if (tokenBalances.length == 0) {
        this.state.tokenList.map((t) => {
          tokenBalances.push(t + ': ' + this.state.balances[t]);
          if (this.state.balances[t] > 0) tokenkinds++;
        });
      }

      tokenBalances = tokenBalances.filter((line) => {
        let symbol = line.substring(0, line.indexOf(':'));
        return BMartService.Registry.isListed(CastIronService.wallet.TokenList[symbol].addr);
      })
      this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
    } else if (tokenBalances.length > 0) {
      this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
    }
  }

  handleChange = (event) => {
    console.log("event.value in GenSheets handleChange is " + event.value);
    let symbol = event.value.substring(0, event.value.indexOf(':'));
    CastIronActions.selectedTokenUpdate(symbol);
  }

  handleClickTransactETH = () => {
    if (typeof(this.rootViews[this.state.currentView]) === 'undefined') CastIronActions.changeView("Transfer");
    CastIronActions.selectedTokenUpdate("");
    let tokenBalances = [];
    let tokenkinds = 0;
    this.state.tokenList.map((t) => {
      tokenBalances.push(t + ': ' + this.state.balances[t]);
      if (this.state.balances[t] > 0) tokenkinds++;
    });
    this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
  }

  handleClickTransact = () => {
    if (this.state.selected_token_name === "") {
      this.openModal("Please select a token first!")
    } else {
      CastIronActions.changeView("Transfer");
    }

  }

  handleClickTrade = () => {
    if (this.state.selected_token_name === "") {
      this.openModal("Please select a token first!")
      let tokenBalances = [];
      let tokenkinds = 0;
      this.state.tokenList.map((t) => {
        if (BMartService.Registry.isListed(CastIronService.wallet.TokenList[t].addr)) {
          tokenBalances.push(t + ': ' + this.state.balances[t]);
          tokenkinds++;
        }
      });
      this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });

    } else {
      CastIronActions.changeView("Trade");
    }
  }

  render = () => {
    if (this.state.address == '') return (<p />);

    return (
      <div className="quickbalance">
          <div className="item teth"><p>ETHER</p></div>
          <div className="item beth"><p style={{color: "white", fontSize: "16px"}}>{this.state.balances['ETH']}</p></div>
          <div className="item terc20"><p>ERC20</p></div>
            <Dropdown className="berc20" options={this.state.tokenBalances} 
                      onChange={this.handleChange} 
                      value={this.state.selected_token_name !== '' ? this.state.selected_token_name + ': ' + this.state.balances[this.state.selected_token_name] : ''} 
                      placeholder={'Found ' + this.state.tokenkinds + ' tokens'} 
                      />
          <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
      </div>
    );
  }
}

export default GenSheets;