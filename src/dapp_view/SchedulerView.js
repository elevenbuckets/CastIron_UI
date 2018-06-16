import CastIronStore from "../store/CastIronStore";
import CastIronService from "../service/CastIronService";
import Reflux from 'reflux';
import React from 'react';
import Dropdown from 'react-dropdown';
import CastIronActions from '../action/CastIronActions';
import TxObjects from '../view/TxObjects';
import TxQList from '../view/TxQList';
import { createCanvasWithAddress } from "../util/Utils";

class SchedulerView extends Reflux.Component {
    constructor(props) {
        super(props);
        this.store = CastIronStore;
        this.state = {
            recipient: '',
        };

        this.state.ScheduledQs = [{ Qid: "1123123123", Name: "paly", Trigger: "BlockHeight", Target: "1235" }]

        this.wallet = CastIronService.wallet;
        this.timeout;
    }

    handleEnqueue(tx) {
        CastIronActions.enqueue(tx);
    }

    handleDequeue(tx) {
        CastIronActions.dequeue(tx);
    }

    handleClearQueue() {
        CastIronActions.clearQueue();
    }


    handleSend(addr, type, amount, gasNumber) {
        // CastIronActions.send(addr, type, amount, gasNumber);
    }

    handleBatchSend() {
        // CastIronActions.batchSend();
    }


    handleChange = (event) => {
        let addr = event.target.value;
        console.log('got addr: ' + addr);
        try {
            if (CastIronService.wallet.web3.isAddress(addr) === true
                && (CastIronService.wallet.web3.toAddress(addr) == addr || CastIronService.wallet.web3.toChecksumAddress(addr) == addr)
            ) {
                addr = CastIronService.wallet.web3.toAddress(addr);
                createCanvasWithAddress(this.refs.canvas, addr);
            } else {
                this.refs.canvas.getContext('2d').clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
            }
        } catch (err) {
            this.refs.canvas.getContext('2d').clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
        }

        this.setState(() => { return { recipient: addr } });
    }


    getQsComponent = () => {
        if (this.state.ScheduledQs) {
            return this.state.ScheduledQs.map((q) => {
                return (
                    <tr className="balance-sheet">
                        <td className="balance-sheet"
                            width='5%'><input
                            name="check"
                            type="checkbox" /></td>
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
        return (
            <div>
                <table className="balance-sheet">
                    <tbody>
                        <tr className="avatar" style={{ textAlign: "center" }}>
                            <th colSpan="3" className="avatar" style={{ textAlign: "center" }}>Schedular</th>
                        </tr>
                        <tr className="balance-sheet">
                            <td className="txform" ><input type="button" className="button" value='New' onClick={null} /></td>
                            <td className="txform"><input type="button" className="button" value='Edit' onClick={null} /></td>
                            <td className="txform"><input type="button" className="button" value='Search' onClick={null} /></td>

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
            </div>
        );
    }
}

export default SchedulerView
