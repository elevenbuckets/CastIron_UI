import React, { Component } from 'react';
class Account extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props)
        return (
            <div>
               {this.props.account.name + ":"+ this.props.account.addr + " blance:"+  this.props.account.balance + " ETH"}
            </div>
        )
    }

}

export default Account