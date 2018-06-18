import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
class SellShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otherstores: []
        }
    }

    balanceBar = () => {
	 let secureDeposit = this.props.paidback ? 0 : this.props.shopDeposit;
	 let earnings = this.props.shopBalance - secureDeposit;
	 let outlooks = Number(this.props.sellOrder["amount"]) * Number(this.props.sellOrder["price"]);
	 let grandTotal = Number(this.props.shopBalance) + Number(outlooks);
	 let barOnePercent = String(Number((secureDeposit / grandTotal) * 100).toFixed(2)) + '%';
	 let barTwoPercent = String(Number((earnings / grandTotal) * 100).toFixed(2)) + '%';
	 let barThreePercent = String(Number((outlooks / grandTotal) * 100).toFixed(2)) + '%';

	 if (grandTotal === 0) { return (<div> Ready to create new order! </div>)};

	 return (<div>
	    <div className="stacked-bar-graph">
		    <span style={
			    {
				display: "inline-block",
		    		height: "90%",
				width: barOnePercent,
    				boxSizing: "border-box",
    				float: "left",
    				fontWeight: "bold",
    				padding: '10px 0px 10px 0px',
				backgroundColor: "#F7B334",
			    }
		    }></span>
		    <span style={
			    {
				display: "inline-block",
		    		height: "90%",
				width: barTwoPercent,
    				boxSizing: "border-box",
    				float: "left",
    				fontWeight: "bold",
    				padding: '10px 0px 10px 0px',
				backgroundColor: "#D57E00",
			    }
		    }></span>
		    <span style={
			    {
				display: "inline-block",
		    		height: "90%",
				width: barThreePercent,
    				boxSizing: "border-box",
    				float: "left",
    				fontWeight: "bold",
    				padding: '10px 0px 10px 0px',
				backgroundColor: "#A7A9AC",
			    }
		    }></span>
	     </div>
		    <label style={{marginRight: "20px"}}>
		      <div style={{display: 'inline-block', backgroundColor: "#F7B334", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px'}}></div>
		        {"Deposit: " + barOnePercent}
		    </label>
		    <label style={{marginRight: "20px"}}>
		      <div style={{display: 'inline-block', backgroundColor: "#D57E00", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px'}}></div>
		        {"Earned: " + barTwoPercent}
		    </label>
		    <label style={{marginRight: "20px"}}>
		      <div style={{display: 'inline-block', backgroundColor: "#A7A9AC", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px'}}></div>
		        {"Projected: " + barThreePercent}
		    </label>
	    </div>)
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
			    { (this.props.disableCreateStore && this.props.totalTake > 0) 
				    ? <td className="balance-sheet" style={{minWidth: '146px', whiteSpace: 'nowrap'}}>{"Total: " + this.props.totalTake + " ETH"}</td>
				    : null
			    }
                        </tr>
                        <tr className="balance-sheet">
                            <td className="balance-sheet" rowSpan='2'> <input type="button"
                                className="button" value="Create Store" disabled={this.props.disableCreateStore}
                                onClick={this.props.createStore} /></td>
                            <td className="balance-sheet" rowSpan={this.props.disableCreateStore ? 2 : 1}>
			    	{ this.props.disableCreateStore 
					? this.balanceBar() 
					: "Estimate Gas Cost: 2000000"
				}
			    </td>
			    { (this.props.disableCreateStore && this.props.totalTake > 0)
				   ? <td className="balance-sheet" rowSpan="2"><input type="button" className="button" value="Withdraw" onClick={this.props.withdraw}/></td>
				   : null
			    }
                        </tr>

			{ this.props.disableCreateStore ? null :
                          <tr className="balance-sheet">
                              <td className="balance-sheet" style={{background: "#ffffff"}}>
                                  {"Estimate Deposit :" + this.props.estimateDeposit + "ETH"}</td>
                          </tr>
			}

                    </tbody>
                </table>
            </div>
        )
    }

}

export default SellShop
