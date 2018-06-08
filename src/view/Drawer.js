'use strict'
import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import CastIronActions from '../action/CastIronActions'
import castIronService from "../service/CastIronService";
import React from 'react';

// Reflux components

class Drawer extends Reflux.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
		<div id="drawer" className={this.props.draw ? 'raise' : 'close'} >
			<div className="card">
  				<img src="assets/clock-icon.png" style={{width: "64px", height: "64px", marginTop: "16px", marginBotton: "9px"}}/>
				<p style={{textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden", fontWeight: "bold"}}>Schedular</p>
			</div>
		</div>
	)
    }
}

export default Drawer
