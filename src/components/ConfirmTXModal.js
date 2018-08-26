import React, { Component } from 'react';
class ConfirmTXModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="confirmModal">
                <input type="button" className="button" value='Confirm' style={{gridArea: "confirm"}} onClick={this.props.confirmTX} />
                <input type="button" className="button xbutton" value='Cancel'style={{gridArea: "cancel"}} onClick={this.props.cancelTX} />
            </div>
        )
    }

}

export default ConfirmTXModal