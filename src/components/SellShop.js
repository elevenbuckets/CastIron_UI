import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
class SellShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otherstores : []
        }
    }

    render() {
        return (
            <div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <th className="balance-sheet" style={{ color: '#111111' }} width='816px'>
                                <Dropdown options={this.state.otherstores}
                                    onChange={this.handleChange}
                                    value={ ''}
                                    placeholder={'Use other shops'} /></th>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet"> <input type="button" className="button" value="Create Store"
                                onClick={this.props.createStore} /></td>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet">
                                EstimateGasCost: 250000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

export default SellShop