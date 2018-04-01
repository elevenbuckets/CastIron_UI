import React, { Component } from 'react';
class Receipt extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let receipt = {};
        receipt.txHash= this.props.receipt.transactionHash;
        receipt.from = this.props.receipt.from;
        receipt.to= this.props.receipt.to;
        receipt.blockNumber= this.props.receipt.blockNumber;
        return (
            <div>
               {JSON.stringify(receipt)}
            </div>
        )
    }

}

export default Receipt