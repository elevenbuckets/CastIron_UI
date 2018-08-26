import React from 'react';
import Modal from 'react-modal';
class AppInstallationModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            availableApps: {
                Schedular: {
                    status: "Not Installed"
                }
            }
        }
    }


    handleClickInstall = (appName) => {

        let stage = Promise.resolve();
        stage.then(() => {
            return this.setState({
                availableApps: {
                    Schedular: {
                        status: "Installing..."
                    }
                }
            });

        }).then(() => {
            return  this.props.install(appName);

        }).then(()=>{
            return this.setState({
                availableApps: {
                    Schedular: {
                        status: "Installed"
                    }
                }
            });
        });

       
    }


    render() {
        return (
            <Modal isOpen={this.props.isAppInstallationModalOpen} style=
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
                                <td className="txform" width='32%'>App Name</td>
                                <td className="txform" width='32%'>Status</td>
                                <td className="txform" width='36' >Action</td>
                            </tr>
                            {this.state.availableApps == null ? "" : Object.keys(this.state.availableApps).map((key) => {
                                return (
                                    <tr>
                                        <td className="txform" width='32%'>{key}</td>
                                        <td className="txform" width='32%'>{this.state.availableApps[key].status}</td>
                                        <td className="txform" width='36%' ><input type="button" className="button"
                                            value='Install' onClick={this.handleClickInstall.bind(this, key)}
                                            style={{ width: '160px', marginTop: '9px', marginLeft: '25%', marginRight: '5%' }} /></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div>
                    <input type="button" className="button"
                        value='Goback' onClick={this.props.goBack}
                        style={{ width: '160px', marginTop: '9px', marginLeft: '40%', marginRight: '30%' }} />
                </div>
            </Modal>

        )
    }

}

export default AppInstallationModal