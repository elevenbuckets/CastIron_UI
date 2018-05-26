import React, { Component } from 'react';
class SellOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <td colSpan="4" className="balance-sheet" >Amount : 20, Price: 0.15</td>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet" > <input type="button" className="button" value="Create"
                                onClick={this.createOrder} /></td>
                            <td className="balance-sheet"> <input type="button" className="button" value="Cancel"
                                onClick={this.cancelOrder} /></td>
                            <td className="balance-sheet"> <input type="button" className="button" value="Change Price"
                                onClick={this.changePrice} /></td>
                            <td className="balance-sheet"> <input type="button" className="button" value="Restock"
                                onClick={this.restock} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

export default SellOrder