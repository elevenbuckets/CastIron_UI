import React, { Component } from 'react';
import Reflux from 'reflux';
import CastIronStore from '../store/CastIronStore';
import CastIronService from '../service/CastIronService';
import Receipt from './Receipt';


class Receipts extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }
    render() {

        return (
            <div>
                <p>These are receipts:</p>
                {this.props.receipts.map((receipt, index) => (
                    <Receipt key={index} receipt={receipt} />)
                )}
            </div>
        )
    }


}

export default Receipts