import React, { Component } from 'react';
import SingleTX from './SingleTX'

class QueuedTX extends React.Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleDequeue = this.handleDequeue.bind(this);
    }

    onFormSubmit() {
        e.preventDefault();
        const addr = e.target.elements.addr.value.trim();
        const amount = e.target.elements.amount.value.trim();
        const gasNumber = e.target.elements.gasNumber.value.trim();
        this.props.sendTX(addr, amount);
    }

    handleDequeue(){
        this.props.handleDequeue(this.props.tx);
    }
    render() {
        let tx = this.props.tx;

        return (
            <div>
               {JSON.stringify(tx)}
               <button onClick = {this.handleDequeue}> Dequeue</button>
            </div>
        )
    }

}

export default QueuedTX