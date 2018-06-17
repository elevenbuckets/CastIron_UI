import React, { Component } from 'react';
import Modal from 'react-modal';
class ScheduleTXModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            queue: null
        }
    }

    changeQueue(field, event) {
        this.setState({ queue: { ...this.state.queue, [field]: event.target.value } })
    }

    handleClickConfirm = () => {
        this.props.confirmScheduleTX(this.state.queue);
    }

    render() {
        return (
            <Modal isOpen={this.props.isScheduleModalOpen} style=
                {
                    {
                        overlay: {
                            width: '100%',
                            maxHeight: '100%',
                            zIndex: '1005'
                        },
                        content: {
                            top: '200px',
                            left: '300px',
                            right: '300px',
                            bottom: '200px'

                        }
                    }
                }>
                <table className="txform">
                    <tbody>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                Name<br /><div style={{ textAlign: 'center' }}><input type='text' size='32'
                                    onChange={this.changeQueue.bind(this, "name")} /></div>
                            </td>
                        </tr>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                Trigger<br /><div style={{ textAlign: 'center' }}><input type='text' size='32'
                                    onChange={this.changeQueue.bind(this, "trigger")} /></div>
                            </td>
                        </tr>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                Target<br /><div style={{ textAlign: 'center' }}><input type='text' size='32'
                                    onChange={this.changeQueue.bind(this, "target")} /></div>
                            </td>
                        </tr>
                        <tr className="txform">
                            <td className="txform" width='25%'>
                                Tolerance<br /><div style={{ textAlign: 'center' }}><input type='text' size='32'
                                    onChange={this.changeQueue.bind(this, "tolerance")} /></div>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <div>
                    <input type="button" className="button"
                        value='Confirm' onClick={this.handleClickConfirm}
                        style={{ width: '160px', marginTop: '9px', marginLeft: '5%', marginRight: '5%' }} />
                    <input type="button" className="button"
                        value='Cancel' onClick={this.props.cancelScheduleTX}
                        style={{ backgroundColor: 'rgb(250,0,0)', width: '160px', marginTop: '9px', marginLeft: '5%', marginRight: '5%' }} />
                </div>
            </Modal>

        )
    }

}

export default ScheduleTXModal