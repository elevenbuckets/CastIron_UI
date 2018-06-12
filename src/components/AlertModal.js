import React, { Component } from 'react';
import Modal from 'react-modal';
class AlertModal extends React.Component {

    // For ex, <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>
    // need three props : content, isAlertModalOpen, close
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal isOpen={this.props.isAlertModalOpen} style=
                {
                    {
                        overlay: {
                            width: '100%',
                            maxHeight: '100%',
                            zIndex: '1005'
                        },
                        content: {
                            top: '400px',
                            left: '400px',
                            right: '400px',
                            bottom: '400px'

                        }
                    }
                }> {this.props.content}
                <div style={{ marginTop: '40px', textAlign: "center" }}>
                    <input type="button" className="button"
                        value='OK' onClick={this.props.close}
                    />
                </div>
            </Modal>

        )
    }

}

export default AlertModal