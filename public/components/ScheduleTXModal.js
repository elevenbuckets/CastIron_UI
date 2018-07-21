'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactModal = require('react-modal');

var _reactModal2 = _interopRequireDefault(_reactModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScheduleTXModal = function (_React$Component) {
    _inherits(ScheduleTXModal, _React$Component);

    function ScheduleTXModal(props) {
        _classCallCheck(this, ScheduleTXModal);

        var _this = _possibleConstructorReturn(this, (ScheduleTXModal.__proto__ || Object.getPrototypeOf(ScheduleTXModal)).call(this, props));

        _this.handleClickConfirm = function () {
            _this.props.confirmScheduleTX(_this.state.queue);
        };

        _this.handleTriggerSelect = function (event) {
            _this.setState({ queue: _extends({}, _this.state.queue, { trigger: event.currentTarget.defaultValue }) });
        };

        _this.state = {
            queue: null
        };
        return _this;
    }

    _createClass(ScheduleTXModal, [{
        key: 'changeQueue',
        value: function changeQueue(field, event) {
            this.setState({ queue: _extends({}, this.state.queue, _defineProperty({}, field, event.target.value)) });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactModal2.default,
                { isOpen: this.props.isScheduleModalOpen, style: {
                        overlay: {
                            width: '100%',
                            maxHeight: '100%',
                            zIndex: '1005'
                        },
                        content: {
                            top: '200px',
                            left: '400px',
                            right: '400px',
                            bottom: '300px'

                        }
                    } },
                _react2.default.createElement(
                    'table',
                    { className: 'txform' },
                    _react2.default.createElement(
                        'tbody',
                        null,
                        _react2.default.createElement(
                            'tr',
                            { className: 'txform' },
                            _react2.default.createElement(
                                'td',
                                { className: 'txform', width: '25%' },
                                'Name',
                                _react2.default.createElement('br', null),
                                _react2.default.createElement(
                                    'div',
                                    { style: { textAlign: 'center' } },
                                    _react2.default.createElement('input', { type: 'text', size: '32',
                                        onChange: this.changeQueue.bind(this, "name") })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'tr',
                            { className: 'txform' },
                            _react2.default.createElement(
                                'td',
                                { className: 'txform', width: '25%' },
                                _react2.default.createElement(
                                    'form',
                                    { onSubmit: function onSubmit(e) {
                                            e.preventDefault();
                                        } },
                                    _react2.default.createElement(
                                        'tr',
                                        { className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
                                        _react2.default.createElement(
                                            'td',
                                            { colSpan: '5', className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
                                            _react2.default.createElement(
                                                'label',
                                                { style: { fontSize: '1.2em', fontWeight: "bold" } },
                                                'Trigger: '
                                            ),
                                            _react2.default.createElement('br', null)
                                        )
                                    ),
                                    _react2.default.createElement(
                                        'tr',
                                        { className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
                                        _react2.default.createElement(
                                            'td',
                                            { className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)", marginLeft: "30px" } },
                                            _react2.default.createElement(
                                                'label',
                                                { style: { fontSize: '1.05em', fontWeight: "bold" } },
                                                _react2.default.createElement('input', { type: 'radio',
                                                    onClick: this.handleTriggerSelect, name: 'gasprice', value: 'BlockHeight' }),
                                                'BlockHeight'
                                            ),
                                            _react2.default.createElement('br', null)
                                        ),
                                        _react2.default.createElement(
                                            'td',
                                            { className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
                                            _react2.default.createElement(
                                                'label',
                                                { style: { fontSize: '1.05em', fontWeight: "bold" } },
                                                _react2.default.createElement('input', { type: 'radio',
                                                    onClick: this.handleTriggerSelect, name: 'gasprice', value: 'BlockTime' }),
                                                'BlockTime'
                                            ),
                                            _react2.default.createElement('br', null)
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'tr',
                            { className: 'txform' },
                            _react2.default.createElement(
                                'td',
                                { className: 'txform', width: '25%' },
                                'Target',
                                _react2.default.createElement('br', null),
                                _react2.default.createElement(
                                    'div',
                                    { style: { textAlign: 'center' } },
                                    _react2.default.createElement('input', { type: 'text', size: '32',
                                        onChange: this.changeQueue.bind(this, "target") })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'tr',
                            { className: 'txform' },
                            _react2.default.createElement(
                                'td',
                                { className: 'txform', width: '25%' },
                                'Tolerance',
                                _react2.default.createElement('br', null),
                                _react2.default.createElement(
                                    'div',
                                    { style: { textAlign: 'center' } },
                                    _react2.default.createElement('input', { type: 'text', size: '32',
                                        onChange: this.changeQueue.bind(this, "tolerance") })
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement('input', { type: 'button', className: 'button',
                        value: 'Confirm', onClick: this.handleClickConfirm,
                        style: { width: '160px', marginTop: '9px', marginLeft: '5%', marginRight: '5%' } }),
                    _react2.default.createElement('input', { type: 'button', className: 'button',
                        value: 'Cancel', onClick: this.props.cancelScheduleTX,
                        style: { backgroundColor: 'rgb(250,0,0)', width: '160px', marginTop: '9px', marginLeft: '5%', marginRight: '5%' } })
                )
            );
        }
    }]);

    return ScheduleTXModal;
}(_react2.default.Component);

exports.default = ScheduleTXModal;