import React, { Component } from 'react';
class SellOrder extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ padding: "50px 139px 70px 139px" }}>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <td className="txform" rowSpan="300" style={{minWidth: "300px", padding: "10px"}}>
			      <table className="txform">
			        <tbody>
				<tr className="txform">
				  <td className="txform" style={{backgroundColor: '#eeeeee'}}>Symbol:</td>
				  <td className="txform">{this.props.symbol}</td>
				</tr>
				<tr className="txform">
				  <td className="txform" style={{backgroundColor: '#eeeeee'}}>Name:</td>
				  <td className="txform">{this.props.tokenName}</td>
				</tr>
				<tr className="txform">
				  <td className="txform" style={{backgroundColor: '#eeeeee'}}>Decimals:</td>
				  <td className="txform">{this.props.decimals}</td>
				  </tr>
				<tr className="txform">
				  <td className="txform" style={{backgroundColor: '#eeeeee'}}>Logo:</td>
				  <td className="txform" style={{textAlign: 'center'}}>
				    <div style={{border: "1px solid #eeeeee", display: 'inline-block', padding: "0px", textAlign: 'center'}}>
				       <img src="assets/token_default.png" style={{width: '96px', height: '96px'}} />
				    </div>
				  </td>
				  </tr>
				</tbody>
			      </table>
			    </td>
                            <td className="balance-sheet" colSpan='2' >
                                {this.props.sellOrder ? "Order Size : " + this.props.sellOrder["amount"] + ", Price : " + this.props.sellOrder["price"] + ", Total: " + (this.props.sellOrder["amount"] * this.props.sellOrder["price"]).toFixed(6) : "--"}</td>
                        </tr>
                        <tr className="balance-sheet" hidden={this.props.disableCreateOrder} style={{marginBottom: "80px"}}>
                            <td className="txform" width='73%'>
                                Amount<br /><div style={{ textAlign: 'center', marginLeft: '30px', marginBottom: '20px' }}><input type='text' size='42' onChange={this.props.handleChangeAmount} /></div>
                            </td>

                            <td className="balance-sheet" rowSpan="2" style={{padding: "92px"}}> <input type="button" className="button" value="Create"
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
