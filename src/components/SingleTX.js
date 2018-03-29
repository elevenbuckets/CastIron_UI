import React, { Component } from 'react';

class SingleTX extends React.Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(e) {
        e.preventDefault();
        const addr = e.target.elements.addr.value.trim();
        const amount = e.target.elements.amount.value.trim();
        const gasNumber = e.target.elements.gasNumber.value.trim();
        if(this.props.actionName == "Send"){
            this.props.sendTX(addr, amount, gasNumber);
        }else if(this.props.actionName == "Enqueue"){
            let tx = {};
            tx.from = this.props.selected_account.addr;
            tx.addr = addr;
            tx.amount = amount;
            tx.gasNumber = gasNumber;
            this.props.handleEnqueue(tx);
        }
      
        
    }

    render() {

        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    <label> Address:</label>
                    <input type='text' name="addr" />
                    <label> Amount:</label>
                    <input type='text' name="amount" />
                    <label> Gas:</label>
                    <input type='text' name="gasNumber" />
                    <button> {this.props.actionName} </button>
                </form>
            </div>
        )
    }

}

export default SingleTX