import React, { Component } from 'react';
import SingleTX from './SingleTX'
import QueuedTX from './QueuedTX'


class QueuedTXS extends React.Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);

        this.state = {
          
        }
    }

    onFormSubmit() {
        e.preventDefault();
        const addr = e.target.elements.addr.value.trim();
        const amount = e.target.elements.amount.value.trim();
        const gasNumber = e.target.elements.gasNumber.value.trim();
        this.props.sendTX(addr, amount);
    }

    render() {

        return (
            <div>
                {
                    this.props.queuedTxs.map((tx, index) =>(<QueuedTX key={index} tx={tx} 
                    handleDequeue={this.props.handleDequeue}/>) )
                }
            </div>
        )
    }

}

export default QueuedTXS