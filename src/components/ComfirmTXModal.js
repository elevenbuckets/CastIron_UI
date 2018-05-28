import React, { Component } from 'react';
class ConfirmTXModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <input type="button" className="button"
                    value='Confirm' onClick={this.props.confirmTX}
                    style={{ width: '160px', marginTop: '9px', marginLeft: '5%', marginRight: '5%' }} />
                <input type="button" className="button"
                    value='Cancel' onClick={this.props.cancelTX}
                    style={{ backgroundColor: 'rgb(250,0,0)', width: '160px', marginTop: '9px', marginLeft: '5%', marginRight: '5%' }} />
            </div>
        )
    }

}

export default ConfirmTXModal