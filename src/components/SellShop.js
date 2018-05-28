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
            <div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <th className="balance-sheet" style={{ color: '#111111' }} width='816px' colSpan='2' >
                                <Dropdown options={this.props.shopAddrs}
                                    onChange={this.props.useOtherStore}
                                    value={''}
                                    placeholder={this.props.disableCreateStore ? this.props.address : 'Use other shops'} /></th>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet" rowSpan='2'> <input type="button"
                                className="button" value="Create Store" disabled={this.props.disableCreateStore}
                                onClick={this.props.createStore} /></td>
                            <td className="balance-sheet">
                                Estimate Gas Cost: 2000000</td>
                        </tr>

                        <tr className="balance-sheet">
                            <td className="balance-sheet">
                                {"Estimate Deposit :" + this.props.estimateDeposit + "ETH"}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        )
    }

}

export default SellShop