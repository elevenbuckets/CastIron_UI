import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import CastIronActions from '../action/CastIronActions';
import TxObjects from '../view/TxObjects';
import TxQList from '../view/TxQList';
import { createCanvasWithAddress, setDappLocalState } from "../util/Utils";
import SchedulerJob from './SchedulerJob';

class SchedulerView extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.state = {
            dappLocal: {
                recipient: '',
                schedulerViewType: "List", // Options are List, New, Edit
                selectedQids: []
            }

        };
        this.wallet = CastIronService.wallet;
    }


    goTo = (view) => {
        setDappLocalState(this, { schedulerViewType: view });
    }

    checked = (Qid, event) => {
        if (event.target.checked) {
            setDappLocalState(this, { selectedQids: [...this.state.dappLocal.selectedQids, Qid] })
        } else {
            if (this.state.dappLocal.selectedQids.indexOf(Qid) != -1) {
                this.state.dappLocal.selectedQids.splice(this.state.dappLocal.selectedQids.indexOf(Qid), 1);
                setDappLocalState(this, { selectedQids: this.state.dappLocal.selectedQids })
            }

        }
    }

    getQsComponent = () => {
        if (this.state.scheduledQs) {
            return this.state.scheduledQs.map((q) => {
                return (
                    <tr className="balance-sheet">
                        <td className="balance-sheet"
                            width='5%'><input
                                name="check"
                                type="checkbox"
                                onChange={this.checked.bind(this, q.Qid)}
                                style={{ width: "25px", height: "25px" }} /></td>
                        <td className="balance-sheet"
                            width='35%'>{q.Qid}</td>
                        <td className="balance-sheet"
                            width='20%'>{q.name}</td>
                        <td className="balance-sheet"
                            width='20%'>{q.trigger}</td>
                        <td className="balance-sheet"
                            width='10%'>{q.target}</td>
                        <td className="balance-sheet"
                            width='10%'>{q.tolerance}</td>

                    </tr>
                );
            })
        }

    }



    render = () => {
        return this.state.dappLocal.schedulerViewType == "List" ? (<div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="avatar" style={{ textAlign: "center" }}>
                            <th colSpan="2" className="avatar" style={{ textAlign: "center" }}>Schedular</th>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="txform" style={{border: '0', padding: '2px', textAlign: "left"}}>
                              <input type="button" className="bbutton" value='New' onClick={this.goTo.bind(this, "New")} />
                              <input type="button" className="bbutton" value='Edit' onClick={this.goTo.bind(this, "New")} disabled="true" />
                              <input type="button" className="bbutton" value='Search' onClick={null} />
			    </td>
                            <td className="txform" style={{border: '0', textAlign: "center", padding: '0px'}}>
			      <p style={{fontSize: '1.2em', padding: '0px', margin: '0px'}}>Active Tasks: {1}</p>
			    </td>
                        </tr>
                    </tbody>
                </table>
            <div style={{ overflow: 'scroll', margin: '0', maxHeight: "490px", height: '490px' }} >
                    <table className="balance-sheet">
                        <tbody>
                            <tr className="balance-sheet">
                                <th className="balance-sheet" style={{ color: '#111111' }} width='5%'>Select</th>
                                <th className="balance-sheet" style={{ color: '#111111' }} width='25%'>Qid</th>
                                <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Name</th>
                                <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Trigger</th>
                                <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Target</th>
                                <th className="balance-sheet" style={{ color: '#111111' }} width='10%'>Tolerance</th>
                            </tr>
                            {this.getQsComponent()}
                        </tbody>
                    </table>
		   </div>
        </div>) : <SchedulerJob goTo={this.goTo} Qid={this.state.dappLocal.selectedQids.length == 0 ?
            null : this.state.dappLocal.selectedQids[0]} />


    }
}

export default SchedulerView
