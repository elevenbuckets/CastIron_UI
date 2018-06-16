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
        if (this.state.ScheduledQs) {
            return this.state.ScheduledQs.map((q) => {
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
                            width='20%'>{q.Name}</td>
                        <td className="balance-sheet"
                            width='20%'>{q.Trigger}</td>
                        <td className="balance-sheet"
                            width='20%'>{q.Target}</td>

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
                        <td className="txform" style={{ border: '0', textAlign: "left" }}>
                            <input type="button" className="bbutton" value='New' onClick={this.goTo.bind(this, "New")} />
                            <input type="button" className="bbutton" value='Edit' onClick={this.goTo.bind(this, "New")} disabled="true" />
                            <input type="button" className="bbutton" value='Search' onClick={null} />
                        </td>
                        <td className="txform" style={{ border: '0', textAlign: "center" }}>
                            <p>Active Tasks: {1}</p>
                        </td>
                    </tr>

                </tbody>
            </table>

            <div style={{ overflow: 'scroll', margin: '0', maxHeight: "490px", height: '490px' }} >
                <table className="balance-sheet">
                    <tbody>
                        <tr className="balance-sheet">
                            <th className="balance-sheet" style={{ color: '#111111' }} width='5%'>Select</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='35%'>Qid</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Name</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Trigger</th>
                            <th className="balance-sheet" style={{ color: '#111111' }} width='20%'>Target</th>

                        </tr>
                        {this.getQsComponent()}
                    </tbody>
                </table>
                <div style=
                    {
                        {
                            textAlign: 'center',
                            backgroundColor: '#ffffff',
                            width: '99.5%',
                            maxHeight: '58',
                            minHeight: '58',
                            zIndex: '2',
                            position: "fixed",
                            bottom: '20%',
                            boxShadow: '0 -5px 6px -5px rgba(200,200,200,0.5)'
                        }
                    }>
                    <input type='text' style={{ paddingTop: '15px', fontFamily: 'monospace', border: 0, width: '85%', fontSize: '1.11em', textAlign: 'center' }} align='center' ref='infocache' value='' />
                </div>
            </div>
        </div>) : <SchedulerJob goTo={this.goTo} Qid={this.state.dappLocal.selectedQids.length == 0 ?
            null : this.state.dappLocal.selectedQids[0]} />


    }
}

export default SchedulerView
