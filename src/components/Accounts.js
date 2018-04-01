import React, { Component } from 'react';
import Account from './Account';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAllAcounts: false
        }
        this.handleClick = this.handleClick.bind(this);

    }

    handleClick() {
        this.setState((preState) => {
            let state = preState;
            state.showAllAcounts = !preState.showAllAcounts;
            return state;
        })
    }

    render() {
        let options = this.props.accounts.map((account) => (JSON.stringify(account)));

        return (
            <div>
                <Dropdown options={options} onChange={this.props._onSelect} value={JSON.stringify(this.state.selected_account)} placeholder="Select an option" />
                <p>The account selected is : {JSON.stringify(this.props.selected_account)}</p>
                <button onClick={this.handleClick}>{this.state.showAllAcounts ? "Hide All Accounts" : "Show All Accounts"}</button>
                {
                    this.state.showAllAcounts &&
                    <div>
                        <p>These are the accounts and balnaces:</p>
                        {this.props.accounts.map((account, index) => (<Account key={index} account={account} />))}
                    </div>
                }
            </div>
        )
    }

}

export default Accounts