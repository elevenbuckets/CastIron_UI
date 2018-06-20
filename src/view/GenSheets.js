import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import CastIronActions from '../action/CastIronActions';
import AlertModal from '../components/AlertModal';
import AlertModalUser from '../common/AlertModalUser';
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
  }


  componentDidUpdate(prevProps, prevState) {
    let tokenBalances = [];
    let tokenkinds = 0;

    if (this.state.address != prevState.address && this.state.address != '') {
      this.state.tokenList.map((t) => {
        tokenBalances.push(t + ': ' + this.state.balances[t]);
        if (this.state.balances[t] > 0) tokenkinds++;
      });
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
    CastIronActions.changeView("Transfer");
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
            <td className="balance-sheet"><input type="button" className="button" onClick={this.handleClickTransactETH} value="Transact ETH" /></td>
            <td className="balance-sheet"><input type="button" className="button" value="Trade ETH" disabled /></td>
          </tr>
          <tr className="balance-sheet">
            <td className="balance-sheet" width='185'>ERC20:</td>
            <td className="balance-sheet" width='35%'>
              <Dropdown options={this.state.tokenBalances} onChange={this.handleChange} value={this.state.selected_token_name !== '' ? this.state.selected_token_name + ': ' + this.state.balances[this.state.selected_token_name] : ''} placeholder={'Found ' + this.state.tokenkinds + ' tokens'} />
            </td>
            <td className="balance-sheet"><input type="button" className="button" onClick={this.handleClickTransact} value={this.state.selected_token_name !== '' ? "Transact " + this.state.selected_token_name : 'Transact ...'} /></td>
            <td className="balance-sheet"><input type="button" className="button" onClick={this.handleClickTrade}
              value={this.state.selected_token_name !== '' ? "Trade " + this.state.selected_token_name : 'Trade ...'}
              disabled={this.state.selected_token_name !== '' &&
                !BMartService.Registry.isListed(CastIronService.wallet.TokenList[this.state.selected_token_name].addr)} /></td>
          </tr>
        </tbody>
        <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal} />
      </table>);
  }
}

export default GenSheets
