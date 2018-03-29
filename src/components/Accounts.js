import React, { Component } from 'react';
import Account from './Account';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css'
class Accounts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options : ["1", "2"],
            selected_account: this.props.accounts[0]
        }

        this._onSelect = this._onSelect.bind(this);

    }

    _onSelect(value){
        this.setState((preState)=>{
            let state = preState;
            state.selected_account = JSON.parse(value.value);
            return state;
        })
       
    }

    render() {
        let options = this.props.accounts.map((account) => ( JSON.stringify(account)));

        return (
            <div>
                <Dropdown options={options} onChange={this.props._onSelect} value={JSON.stringify(this.state.selected_account)} placeholder="Select an option" />
                <p>The account selected is : {JSON.stringify(this.props.selected_account)}</p>
                <p>These are the accounts and balnaces:</p>
                {this.props.accounts.map((account) => (<Account key={JSON.stringify(account)} account={account} />))}
            </div>
        )
    }

}

export default Accounts