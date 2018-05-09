import CastIronStore from "../store/CastIronStore";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import GenSheets from './GenSheets'
import Settings from './Settings'
import CastIronActions from '../action/CastIronActions'

class QueryForm extends Reflux.Component {
  constructor(props) {
    super(props);
    this.store = CastIronStore;
    this.state = {
	    ptoggle: true, 
	    pfield: '28px',
	    visible: false,
	    sbutton: 'none'
    };
  }

  handleMouseDown = (event) => {
    this.toggleSettings();
 
    console.log("clicked");
    event.stopPropagation();
  }
 
  toggleSettings = () => {
    this.setState( { visible: !this.state.visible } );
  } 

  handleChange = (event) => {
    CastIronActions.startUpdate(event.value, this.refs.canvas);
  }

  handleToggle = (event) => {
    let pt = !this.state.ptoggle;
    let sb = pt ? 'none' : 'inline-block';
    let pf = pt ? '100px' : '283px';
    this.setState({ptoggle: pt, pfield: pf, sbutton: sb});
    CastIronActions.masterUpdate(this.refs.mp.value);
  }

  render = () => {
    return (
      <div>
        <Settings handleMouseDown={this.handleMouseDown} visibility={this.state.visible} />
        <table>
          <tbody>
            <tr>
              <td className="avatar" width={201}>
                <canvas ref='canvas' width={66} height={66} style=
                  {
                    {
                      border: "3px solid #ccc",
                      borderBottomLeftRadius: "2.8em",
                      borderBottomRightRadius: "2.8em",
                      borderTopRightRadius: "2.8em",
                      borderTopLeftRadius: "2.8em"
                    }
                  }
                /></td>
              <td>
                <label>
                  Address:
	     <Dropdown ref='addrlist' options={Object.keys(this.state.accounts)} onChange={this.handleChange} value={this.state.address} placeholder="Select an option" />
                </label>
              </td>
	      <td width={this.state.pfield} style={{textAlign: 'center', minWidth:this.state.pfield}} 
		onMouseEnter={this.handleToggle} onMouseLeave={this.handleToggle}>
		 <table border="0"><tbody><tr style={{border: '0px'}} align="center"><td style={{border: '0px', color: this.state.unlocked ? 'green' : 'red'}}>
	           <label style={{fontWeight: 'bold'}}>Master Password</label><br/>
	           <input ref='mp' type='password' maxLength='200' hidden={this.state.ptoggle} style={{marginTop: '7px'}}/>
		 </td>
	         <td style={{border: '0px', display: this.state.sbutton, textAlign: "center"}}>
	           <input type="button" className="button" onMouseDown={this.handleMouseDown} style={{marginTop: '7px'}} value="Settings"/> 
	         </td></tr>
		 </tbody></table>
	      </td>
            </tr>
            <tr><td colSpan="3"><GenSheets /></td></tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default QueryForm
