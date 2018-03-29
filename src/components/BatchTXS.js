import React, { Component } from 'react';
import SingleTX from './SingleTX'
import QueuedTXS from './QueuedTXS';

class BatchTXS extends React.Component {
    constructor(props) {
        super(props);
        // this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    // onFormSubmit() {
    //     e.preventDefault();
    //     const addr = e.target.elements.addr.value.trim();
    //     const amount = e.target.elements.amount.value.trim();
    //     const gasNumber = e.target.elements.gasNumber.value.trim();
    //     this.props.sendTX(addr, amount);
    // }

    render() {

        return (
            <div>
                <p>This is batch txs!</p>
                <SingleTX actionName = "Enqueue" handleEnqueue={this.props.handleEnqueue} selected_account = {this.props.selected_account}/> 
                <p>Here are the queued payments currently: </p>
                <QueuedTXS queuedTxs = {this.props.queuedTxs} selected_account = {this.props.selected_account} 
                handleDequeue={this.props.handleDequeue}/>
                <button onClick={this.props.handleBatchSend}>Send</button>
            </div>
        )
    }

}

export default BatchTXS