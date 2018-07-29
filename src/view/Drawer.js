'use strict'
import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import castIronService from "../service/CastIronService";
import React from 'react';
import DappViewService from '../service/DappViewService';

// Reflux components

class Drawer extends Reflux.Component {
	constructor(props) {
		super(props);
	}

	changeView(view) {
		CastIronActions.changeView(view);
	}

	handleIconClick = (appView, event) => {
		this.changeView(appView);
		this.props.handleClick(event);
	}

	getDappIcons = () => {
		return Object.keys(DappViewService.viewMap).map((key) => {
			let src = "../../dapps/assets/clock-icon.pgn";


			return (<div className="card" onClick={this.handleIconClick.bind(this, key)}>
				<img src={src} style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
				<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>{key}</p>
			</div>)
		})
	}

	render = () => {
		return (
			<div id="drawer" className={this.props.draw ? 'raise' : 'close'} >
				<div className="card" onClick={this.handleIconClick.bind(this, 'Transfer')}>
					<img src="assets/transfer-icon.png" style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
					<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>Wallet</p>
				</div>

				<div className="card">
					<img src="assets/forum-icon.png" style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
					<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>Forum</p>
					<div className="label-soon">Comming Soon!</div>
				</div>
				<div className="card">
					<img src="assets/delegate-icon.png" style={{ width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px" }} />
					<p style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold" }}>Delegates</p>
					<div className="label-soon">Comming Soon!</div>
				</div>
			</div>
		)
	}
}

export default Drawer
