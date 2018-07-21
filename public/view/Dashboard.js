'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _reactRouterDom = require('react-router-dom');

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _WalletView = require('./WalletView');

var _WalletView2 = _interopRequireDefault(_WalletView);

var _ReceiptsView = require('./ReceiptsView');

var _ReceiptsView2 = _interopRequireDefault(_ReceiptsView);

var _QueryForm = require('./QueryForm');

var _QueryForm2 = _interopRequireDefault(_QueryForm);

var _Footer = require('./Footer');

var _Footer2 = _interopRequireDefault(_Footer);

var _Drawer = require('./Drawer');

var _Drawer2 = _interopRequireDefault(_Drawer);

var _Transfer = require('./Transfer');

var _Transfer2 = _interopRequireDefault(_Transfer);

var _Trade = require('./Trade');

var _Trade2 = _interopRequireDefault(_Trade);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

var _ConfirmTXModal = require('../components/ConfirmTXModal');

var _ConfirmTXModal2 = _interopRequireDefault(_ConfirmTXModal);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _AlertModal = require('../components/AlertModal');

var _AlertModal2 = _interopRequireDefault(_AlertModal);

var _ScheduleTXModal = require('../components/ScheduleTXModal');

var _ScheduleTXModal2 = _interopRequireDefault(_ScheduleTXModal);

var _DappViewService = require('../service/DappViewService');

var _DappViewService2 = _interopRequireDefault(_DappViewService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DashBoard = function (_Reflux$Component) {
    _inherits(DashBoard, _Reflux$Component);

    function DashBoard(props) {
        _classCallCheck(this, DashBoard);

        var _this = _possibleConstructorReturn(this, (DashBoard.__proto__ || Object.getPrototypeOf(DashBoard)).call(this, props));

        _this.confirmTX = function () {
            _CastIronActions2.default.confirmTx();
        };

        _this.cancelTX = function () {
            _CastIronActions2.default.cancelTx();
        };

        _this.confirmScheduleTX = function (queue) {
            _CastIronActions2.default.confirmScheduleTx(queue);
        };

        _this.cancelScheduleTX = function () {
            _CastIronActions2.default.cancelScheduleTx();
        };

        _this.handleClick = function (event) {
            _this.setState({ drawerOut: !_this.state.drawerOut });
            event.target.blur();
            event.stopPropagation();
        };

        _this.store = _CastIronStore2.default;
        _this.state = {
            drawerOut: false
        };
        _this.storeKeys = ["unlocked", "currentView", "modalIsOpen", "scheduleModalIsOpen", "accounts"];

        return _this;
    }

    _createClass(DashBoard, [{
        key: 'render',
        value: function render() {
            console.log("in Dashboard render()");
            return _react2.default.createElement(
                'div',
                { id: 'dashboard', className: this.state.drawerOut ? 'raise' : 'close' },
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_QueryForm2.default, { ref: 'queryForm' }),
                    this.state.currentView == "Transfer" ? _react2.default.createElement(_Transfer2.default, null) : this.state.currentView == "Receipts" ? _react2.default.createElement(_ReceiptsView2.default, null) : this.state.currentView == "Trade" ? _react2.default.createElement(_Trade2.default, { canvas: this.refs.queryForm.refs.canvas }) : _DappViewService2.default.getView(this.state.currentView),
                    _react2.default.createElement(_AlertModal2.default, { content: "Please unlock with your master passward!",
                        isAlertModalOpen: this.state.modalIsOpen && !this.state.unlocked, close: this.cancelTX }),
                    _react2.default.createElement(
                        _reactModal2.default,
                        { isOpen: this.state.modalIsOpen && this.state.unlocked, style: {
                                overlay: {
                                    width: '100%',
                                    maxHeight: '100%',
                                    zIndex: '5'
                                },
                                content: {
                                    top: '400px',
                                    left: '400px',
                                    right: '400px',
                                    bottom: '400px'

                                }
                            } },
                        ' Please confirm!',
                        _react2.default.createElement(_ConfirmTXModal2.default, { confirmTX: this.confirmTX, cancelTX: this.cancelTX })
                    ),
                    _react2.default.createElement(_ScheduleTXModal2.default, { confirmScheduleTX: this.confirmScheduleTX, cancelScheduleTX: this.cancelScheduleTX,
                        isScheduleModalOpen: this.state.scheduleModalIsOpen }),
                    _react2.default.createElement(_Footer2.default, { handleDrawer: this.handleClick, draw: this.state.drawerOut })
                ),
                _react2.default.createElement(_Drawer2.default, { refs: 'underlayer', handleClick: this.handleClick, draw: this.state.drawerOut })
            );
        }
    }]);

    return DashBoard;
}(_reflux2.default.Component);

exports.default = DashBoard;