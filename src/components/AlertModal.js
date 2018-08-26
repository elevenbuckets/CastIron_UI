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
            <Modal ariaHideApp={false} isOpen={this.props.isAlertModalOpen} style=
                {
                    {
                        overlay: { width: '100%', maxHeight: '100%', zIndex: '5', backgroundColor: "rgba(0,12,20,0.75)" },
                        content: { 
                            top: '40%', left: '30%', right: '30%', bottom: '40%',
                            border: "2px solid yellow",
                            backgroundColor: "black",
                            borderRadius: "6px",
                            color: "yellow",
                            textAlign: "center",
                            fontSize: "22px",
                            display: "grid",
                            padding: "0px",
                            gridTemplateRows: "1fr 1fr",
                            gridTemplateColumns: "1fr",
                            alignItems: "center"}
                    }
                }> {this.props.content}
                <div style=
                {{  
                    justifyItems: "center",
                    alignItems: "center",
                    textAlign: "center" 
                }}>
                    <input type="button" className="button"
                        value='OK' onClick={this.props.close}
                    />
                </div>
            </Modal>

        )
    }

}

export default AlertModal