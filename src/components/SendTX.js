import React, { Component } from 'react';
import Toggle from 'react-toggle';
import "react-toggle/style.css";
import SingleTX from './SingleTX'
import BatchTXS from './BatchTXS';
class SendTX extends React.Component {
    constructor(props) {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleChangePayments = this.handleChangePayments.bind(this);

        this.state = {
            isBatched: false
        }
    }

    onFormSubmit() {
        e.preventDefault();
        const addr = e.target.elements.addr.value.trim();
        const amount = e.target.elements.amount.value.trim();
        const gasNumber = e.target.elements.gasNumber.value.trim();
        this.props.sendTX(addr, amount);
    }

    handleChangePayments(){
        this.setState((preState)=>{
            let state = preState;
            state.isBatched = !state.isBatched;
            return state;
        })
    }

    render() {
        let isBatched = this.state.isBatched;

        return (
            <div>
                <label>
                    <Toggle
                        checked={isBatched}
                        onChange ={this.handleChangePayments} />
                    <span className='label-text'>Batched Payments</span>
                </label>
            
                {isBatched ? <BatchTXS queuedTxs={this.props.queuedTxs}
                 selected_account = {this.props.selected_account}
                  handleEnqueue={this.props.handleEnqueue} handleDequeue={this.props.handleDequeue}
                  handleBatchSend={this.props.handleBatchSend}/> :<SingleTX actionName = "Send" 
                  sendTX={this.props.handleSend}/>}
            </div>
        )
    }

}

export default SendTX