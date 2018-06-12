import Reflux from 'reflux';
class AlertModalUser extends Reflux.Component {

	// This needs to be used with AlertModal, one can refer to ../view/Settings.js for usage
    constructor(props) {
        super(props);
        this.state = {
			alertContent : "",
			isAlertModalOpen : false
		}
    }

    openModal = (content) =>{
		this.setState({
			alertContent : content,
			isAlertModalOpen : true
		})
	}

	closeModal = () =>{
		this.setState({
			alertContent : "",
			isAlertModalOpen : false
		})
	}



}

export default AlertModalUser