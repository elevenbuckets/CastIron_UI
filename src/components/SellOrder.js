import React, { Component } from 'react';
class SellOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ padding: "50px 300px 90px 300px"}}>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                         
                            <td className="balance-sheet" colSpan='2' >
                                {this.props.sellOrder ? "Order Size : " + this.props.sellOrder["amount"] + ", Price : " + this.props.sellOrder["price"] : "--"}</td>
                        </tr>
                        <tr className="balance-sheet" hidden={this.props.disableCreateOrder}>
                            <td className="txform" width='73%'>
                                Amount<br /><div style={{ textAlign: 'center', marginLeft: '30px', marginBottom: '20px' }}><input type='text' size='42' onChange={this.props.handleChangeAmount} /></div>
                            </td>

                            <td className="balance-sheet" rowSpan="2"> <input type="button" className="button" value="Create"
                                disabled={this.props.disableCreateOrder} onClick={this.props.createOrder} /></td>
                        </tr>
                        <tr className="balance-sheet" hidden={this.props.disableCreateOrder}>
                            <td className="txform" width='73%'>
                                Price<br /><div style={{ textAlign: 'center', marginLeft: '30px', marginBottom: '20px' }}><input type='text' size='42'
                                    onChange={this.props.handleChangePrice} /></div>
                            </td>
                        </tr>

                        <tr className="balance-sheet" hidden={!this.props.disableCreateOrder}>
                            <td className="txform" width='73%'>
                                Price <br /><div style={{ textAlign: 'center', marginLeft: '30px', marginBottom: '20px' }}><input type='text' size='42' onChange={this.props.handleChangePrice} /></div>
                            </td>

                            <td className="balance-sheet"> <input type="button" className="button" value="Change Price"
                                disabled={this.props.disableChangePrice} onClick={this.props.changePrice} /></td>
                        </tr>

                        <tr className="balance-sheet" hidden={!this.props.disableCreateOrder}>
                            <td className="txform" width='73%'>
                                Amount <br /><div style={{ textAlign: 'center', marginLeft: '30px', marginBottom: '20px' }}><input type='text' size='42' onChange={this.props.handleChangeAmount} /></div>
                            </td>

                            <td className="balance-sheet" style={{ background: "#ffffff" }}> <input type="button" style={{width: "130px"}} className="button" value="Restock"
                                disabled={this.props.disableRestock} onClick={this.props.restock} /></td>
                        </tr>
                        <tr className="balance-sheet" hidden={!this.props.disableCreateOrder}>
                            <td className="balance-sheet" colSpan='2'> <input type="button" style={{margin: '10px'}} className="button" value="Cancel"
                                disabled={this.props.disableCancelOrder} onClick={this.props.cancelOrder} /></td>

                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

export default SellOrder
