'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AlertModal = function (_React$Component) {
    _inherits(AlertModal, _React$Component);

    // For ex, <AlertModal content={this.state.alertContent} isAlertModalOpen={this.state.isAlertModalOpen} close={this.closeModal}/>
    // need three props : content, isAlertModalOpen, close
    function AlertModal(props) {
        _classCallCheck(this, AlertModal);

        return _possibleConstructorReturn(this, (AlertModal.__proto__ || Object.getPrototypeOf(AlertModal)).call(this, props));
    }

    _createClass(AlertModal, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactModal2.default,
                { isOpen: this.props.isAlertModalOpen, style: {
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
                    } },
                ' ',
                this.props.content,
                _react2.default.createElement(
                    'div',
                    { style: { marginTop: '40px', textAlign: "center" } },
                    _react2.default.createElement('input', { type: 'button', className: 'button',
                        value: 'OK', onClick: this.props.close
                    })
                )
            );
        }
    }]);

    return AlertModal;
}(_react2.default.Component);

exports.default = AlertModal;