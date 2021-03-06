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
	 
	 let outlooks = 0;
	 if(this.props.sellOrder){
		 outlooks = Number(this.props.sellOrder["amount"]) * Number(this.props.sellOrder["price"]);
	 }
	 let grandTotal = Number(this.props.shopBalance) + Number(outlooks);

	 const __round2 = (num) => { // num must <= 1
		 let bigint = String(num * 10000);
		 if (bigint.indexOf('.') == '-1') bigint = bigint + '.';
		 bigint = bigint.substring(0, bigint.indexOf('.'));
		 if (Number(bigint) == 0) {
			 return '0.00';
		 } else {
			let front = bigint.substring(0, bigint.length-2)  == '' ? '0' : bigint.substring(0, bigint.length-2);
			let back = bigint.substring(bigint.length-2, bigint.length) == '' ? '00' : bigint.substring(bigint.length-2, bigint.length);
			if (back.length < 2) return front + '.0' + back; 
		 	return front + '.' + back;
		 }
	 }

	 let barOne = __round2(secureDeposit / grandTotal);
	 let barTwo = __round2(earnings / grandTotal);
	 let barOnePercent = barOne + '%';
	 let barTwoPercent = barTwo + '%';
	 let barThreePercent = outlooks == 0 ? '0.00%' : __round2((100 - barOne - barTwo) / 100) + '%';

	 if (grandTotal === 0) { 
		 if (this.props.totalOrders== 0) {
		 	return (<div> Ready for new order? Create one below! </div>)
		 } else {
		 	return (<div> Sold out and cashed out! Please restock! </div>)
		 }
	 };

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
		   <table style={{width: '100%', height: "35px", textAlign: 'center'}}><tbody>
		   <tr className="txfrom" style={{textAlign: 'center'}}>
		   <td className="txform" style={{textAlign: 'center', fontWeight: 'bold', border: '0px'}}>Balance:</td>
		   <td className="txform" style={{textAlign: 'center', border: '0px'}}>
		    <label style={{marginRight: "20px"}}>
		      <div style={{display: 'inline-block', backgroundColor: "#F7B334", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px'}}></div>
		        {"Deposit: " + barOnePercent}
		    </label>
		    <label style={{marginRight: "20px"}}>
		      <div style={{display: 'inline-block', backgroundColor: "#D57E00", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px'}}></div>
		        {"Earned: " + barTwoPercent}
		    </label>
		    </td><td className="txform" style={{textAlign: 'center', fontWeight: 'bold', border: '0px'}}>Projected:</td>
		    <td className="txform" style={{textAlign: 'center', border: '0px'}}>
		    <label style={{marginRight: "20px"}}>
		      <div style={{display: 'inline-block', backgroundColor: "#A7A9AC", width: '10px', height: '10px', marginTop: '10px', marginRight: '15px'}}></div>
		        {"Active Order: " + barThreePercent}
		    </label>
		   </td></tr></tbody></table>
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
				    ? <td className="balance-sheet" style={{minWidth: '146px', whiteSpace: 'nowrap'}}>Available: <br/>{this.props.totalTake + " ETH"}</td>
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
