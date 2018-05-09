import Reflux from 'reflux';
import React from 'react';

class Settings extends Reflux.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    let visibility = 'hide';
    if (this.props.visibility) visibility = 'show';

    return (
      <div id="settings"
           className={visibility}>
        <h2><a href="#">General</a></h2><hr color='#333' width='90%'/>
	  <div style={{display: 'block', marginLeft: "7%", marginRight: "10%", marginTop: '40px', marginBottom: '40px', textAlign: "center"}}>
	    <table className="settings-sheet" border="0"><tbody>
	      <form>
	    <tr className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)"}}>
	      <td colSpan="5" className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)"}}>
	        <label style={{fontSize: '1.2em', fontWeight: "bold"}}>Gas Price: </label><br/>
	      </td>
	    </tr>
	    <tr className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)"}}>
	      <td className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)", marginLeft: "30px"}}>
	        <label style={{fontSize: '1.05em', fontWeight: "bold"}}><input type="radio" name="gasprice" value="slow"/>Slow</label><br/>
	      </td>
	      <td className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)"}}>
	        <label style={{fontSize: '1.05em', fontWeight: "bold"}}><input type="radio" name="gasprice" value="mid"/>Mid</label><br/>
	      </td>
	      <td className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)"}}>
	        <label style={{fontSize: '1.05em', fontWeight: "bold"}}><input type="radio" name="gasprice" value="normal"/>Normal</label><br/>
	      </td>
	      <td className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)"}}>
	        <label style={{fontSize: '1.05em', fontWeight: "bold"}}><input type="radio" name="gasprice" value="fast"/>Fast</label><br/>
	      </td>
	      <td className="settings-sheet" style={{backgroundColor: "rgba(0,0,0,0)"}}>
		<label style={{fontSize: '1.05em', fontWeight: "bold"}}><input type="radio" name="gasprice" value=""/>Custom
		  <input type="text" style={{marginLeft: '10px'}} name="custom_gasprice" placeholder="custom (in gwei)..." />
		</label>
	    </td></tr>
	      </form>
	    </tbody></table>
	  </div>
        <h2><a href="#">Accounts</a></h2><hr color='#333' width='90%'/>
	  <div style={{display: 'block', margin: '40px'}}>this is where accounts information can be loaded and editted</div>
        <h2><a href="#">Apps (coming soon!)</a></h2><hr color='#333' width='90%'/>
	  <div style={{display: 'block', margin: '40px'}}>this is where app menu is</div>
        <div style={{margin: '60px', textAlign: "center"}}>
	   <input type="button" className="button" onMouseDown={this.props.handleMouseDown} value="Back" />
	</div>
      </div>
    );
  }
}

export default Settings;
