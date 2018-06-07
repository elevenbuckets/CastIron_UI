import Reflux from 'reflux';
import React from 'react';
import AlertModal from '../components/AlertModal'


class Settings extends Reflux.Component {
	constructor(props) {
		super(props);
		this.state = {
			alertContent : "",
			isAlertModalOpen : false
		}
	}

	handleCustomGasPriceUpdate = (event) =>{
		if(isNaN(event.target.value)){
			this.openModal("Please enter a number!")
		}else{
			this.props.handleCustomGasPriceUpdate(parseInt(event.target.value))
		}	
	}

	handleClickBack = () =>{
		if(!this.props.isCustomGasPriceValid()){
			this.openModal("Please enter custom gas price!")
		  }else{
			this.props.handleClickBack();
		  }
	}

	openModal = (content) =>{
		this.setState({
			alertContent : content,
			isAlertModalOpen : true
		})
	}

	closeModal = () =>{
		this.setState({
			alertContent : "",
			isAlertModalOpen : false
		})
	}


	render = () => {
		let visibility = 'hide';
		if (this.props.visibility) visibility = 'show';

		return (
			<div id="settings"
				className={visibility}>
				<h2><a href="#">General</a></h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', marginLeft: "7%", marginRight: "10%", marginTop: '40px', marginBottom: '40px', textAlign: "center" }}>
					<table className="settings-sheet" border="0"><tbody>
						<form>
							<tr className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
								<td colSpan="5" className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.2em', fontWeight: "bold" }}>Gas Price: </label><br />
								</td>
							</tr>
							<tr className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)", marginLeft: "30px" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="low" />Slow</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="mid" />Mid</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="high" defaultChecked/>Normal</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="fast" />Fast</label><br />
								</td>
								<td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
									<label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
										onClick={this.props.handleGasPriceSelect} name="gasprice" value="custom" />Custom
			<input type="text" style={{ marginLeft: '10px' }} name="custom_gasprice" 
			disabled={this.props.isCustomGasPrice} onChange={this.handleCustomGasPriceUpdate} placeholder="custom (in gwei)..." />
									</label>
								</td></tr>
						</form>
					</tbody></table>
				</div>
				<h2><a href="#">Accounts</a></h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', margin: '40px' }}>this is where accounts information can be loaded and editted</div>
				<h2><a href="#">Apps (coming soon!)</a></h2><hr color='#333' width='90%' />
				<div style={{ display: 'block', margin: '40px' }}>this is where app menu is</div>
				<div style={{ margin: '60px', textAlign: "center" }}>
					<input type="button" className="button" onClick={this.handleClickBack} value="Back" />
				</div>

				
				<AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>

				
			</div>
		);
	}
}

export default Settings;
