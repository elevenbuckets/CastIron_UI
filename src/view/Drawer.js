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
		<div id="drawer" className={this.props.draw ? 'raise' : 'close'}>
		  <table className="settings-sheet" border="0"><tbody><tr height="100%">
		  <td>App01</td>
		  <td>App02</td>
		  <td>App03</td>
		  <td>App04</td>
		  <td>App05</td>
		  <td>App06</td>
		  </tr></tbody></table>
		</div>
	)
    }
}

export default Drawer
