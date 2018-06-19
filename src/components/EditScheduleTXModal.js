import React, { Component } from 'react';
import Modal from 'react-modal';
class EditScheduleTXModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            queue: this.props.Q
        }
    }

    changeQueue(field, event) {
        this.setState({ queue: { ...this.state.queue, [field]: event.target.value } })
    }

    handleClickSave = () => {
        this.props.saveScheduleTX(this.state.queue);
    }

    handleTriggerSelect = ( event) => {
        this.setState({ queue: { ...this.state.queue, trigger: event.currentTarget.defaultValue } });
    }

    render() {
        return (
            <Modal isOpen={this.props.isEditScheduleModalOpen} style=
                {
                    {
                        overlay: {
                            width: '100%',
                            maxHeight: '100%',
                            zIndex: '1005'
                        },
                        content: {
                            top: '100px',
                            left: '100px',
                            right: '100px',
                            bottom: '50px'

                        }
                    }
                }>

                <div style={{ overflow: 'scroll', margin: '0', maxHeight: "430", height: '430px' }} >
        <table className="txform">
          <tbody>
            <tr>
              <td className="txform" width='32%'>From</td>
              <td className="txform" width='32%'>To</td>
              <td className="txform" width='4%'>Type</td>
              <td className="txform" width='10%'>Amount</td>
              <td className="txform" width='10%'>Gas Fee</td>
            </tr>
            {this.props.Q == null ? "" : this.props.Q.args[0].map((tx) => {
              return (
                <tr>
                  <td className="txform" width='32%'>{tx.from}</td>
                  <td className="txform" width='32%'>{tx.to}</td>
                  <td className="txform" width='4%' >{tx.type}</td>
                  <td className="txform" width='10%'>{tx.amount}</td>
                  <td className="txform" width='10%'>{tx.gas * this.props.gasPrice}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
                <table className="txform">
                    <tbody>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                Name<br /><div style={{ textAlign: 'center' }}><input type='text' size='32'
                                    onChange={this.changeQueue.bind(this, "name")}  defaultValue={this.props.Q.name} /></div>
                            </td>
                        </tr>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                <form onSubmit={(e) => { e.preventDefault() }} >
                                    <tr className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
                                        <td colSpan="5" className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
                                            <label style={{ fontSize: '1.2em', fontWeight: "bold" }}>Trigger: </label><br />
                                        </td>
                                    </tr>
                                    <tr className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
                                        <td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)", marginLeft: "30px" }}>
                                            <label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
                                                onClick={this.handleTriggerSelect} name="gasprice" value="BlockHeight"
                                                defaultChecked={this.props.Q.trigger=="BlockHeight"} />BlockHeight</label><br />
                                        </td>
                                        <td className="settings-sheet" style={{ backgroundColor: "rgba(0,0,0,0)" }}>
                                            <label style={{ fontSize: '1.05em', fontWeight: "bold" }}><input type="radio"
                                                onClick={this.handleTriggerSelect} name="gasprice" value="BlockTime" 
                                                defaultChecked={this.props.Q.trigger=="BlockTime"}/>BlockTime</label><br />
                                        </td>
                                    </tr>
                                </form>
                            </td>
                        </tr>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                Target<br /><div style={{ textAlign: 'center' }}><input type='text' size='32'
                                    onChange={this.changeQueue.bind(this, "target")}  defaultValue={this.props.Q.target} /></div>
                            </td>
                        </tr>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                Tolerance<br /><div style={{ textAlign: 'center' }}><input type='text' size='32'
                                    onChange={this.changeQueue.bind(this, "tolerance")} defaultValue={this.props.Q.tolerance}/></div>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <div>
                    <input type="button" className="button"
                        value='Save' onClick={this.handleClickSave}
                        style={{ width: '160px', marginTop: '9px', marginLeft: '25%', marginRight: '5%' }} />
                    <input type="button" className="button"
                        value='Cancel' onClick={this.props.cancelChangeScheduleTX}
                        style={{ backgroundColor: 'rgb(250,0,0)', width: '160px', marginTop: '9px', marginLeft: '5%', marginRight: '5%' }} />
                </div>
            </Modal>

        )
    }

}

export default EditScheduleTXModal