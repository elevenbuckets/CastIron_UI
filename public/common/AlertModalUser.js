"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlertModalUser = function (_Reflux$Component) {
	_inherits(AlertModalUser, _Reflux$Component);

	// This needs to be used with AlertModal, one can refer to ../view/Settings.js for usage
	function AlertModalUser(props) {
		_classCallCheck(this, AlertModalUser);

		var _this = _possibleConstructorReturn(this, (AlertModalUser.__proto__ || Object.getPrototypeOf(AlertModalUser)).call(this, props));

		_this.openModal = function (content) {
			_this.setState({
				alertContent: content,
				isAlertModalOpen: true
			});
		};

		_this.closeModal = function () {
			_this.setState({
				alertContent: "",
				isAlertModalOpen: false
			});
		};

		_this.state = {
			alertContent: "",
			isAlertModalOpen: false
		};
		return _this;
	}

	return AlertModalUser;
}(_reflux2.default.Component);

exports.default = AlertModalUser;