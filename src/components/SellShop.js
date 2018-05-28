import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
class SellShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otherstores: []
        }
    }

    render() {
        return (
            <div style={{padding : "20px"}}>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                        <td className="balance-sheet" >
                                Shop Address</td>
                            <td className="balance-sheet" style={{ color: '#111111' }} width='80%'  >
                                <Dropdown options={this.props.shopAddrs}
                                    onChange={this.props.useOtherStore}
                                    value={''}
                                    placeholder={this.props.disableCreateStore ? this.props.shopAddr : 'Use other shops'} /></td>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet" rowSpan='2'> <input type="button"
                                className="button" value="Create Store" disabled={this.props.disableCreateStore}
                                onClick={this.props.createStore} /></td>
                            <td className="balance-sheet">
                                Estimate Gas Cost: 2000000</td>
                        </tr>

                        <tr className="balance-sheet">
                            <td className="balance-sheet" style={{background: "#ffffff"}}>
                                {"Estimate Deposit :" + this.props.estimateDeposit + "ETH"}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        )
    }

}

export default SellShop