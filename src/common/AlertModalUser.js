import Reflux from 'reflux';
class AlertModalUser extends Reflux.Component {

   
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