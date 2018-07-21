'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SingleTX = require('./SingleTX');

var _SingleTX2 = _interopRequireDefault(_SingleTX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QueuedTX = function (_React$Component) {
    _inherits(QueuedTX, _React$Component);

    function QueuedTX(props) {
        _classCallCheck(this, QueuedTX);

        var _this = _possibleConstructorReturn(this, (QueuedTX.__proto__ || Object.getPrototypeOf(QueuedTX)).call(this, props));

        _this.onFormSubmit = _this.onFormSubmit.bind(_this);
        _this.handleDequeue = _this.handleDequeue.bind(_this);
        return _this;
    }

    _createClass(QueuedTX, [{
        key: 'onFormSubmit',
        value: function onFormSubmit() {
            e.preventDefault();
            var addr = e.target.elements.addr.value.trim();
            var amount = e.target.elements.amount.value.trim();
            var gasNumber = e.target.elements.gasNumber.value.trim();
            this.props.sendTX(addr, amount);
        }
    }, {
        key: 'handleDequeue',
        value: function handleDequeue() {
            this.props.handleDequeue(this.props.tx);
        }
    }, {
        key: 'render',
        value: function render() {
            var tx = this.props.tx;

            return _react2.default.createElement(
                'div',
                null,
                JSON.stringify(tx),
                _react2.default.createElement(
                    'button',
                    { onClick: this.handleDequeue },
                    ' Dequeue'
                )
            );
        }
    }]);

    return QueuedTX;
}(_react2.default.Component);

exports.default = QueuedTX;