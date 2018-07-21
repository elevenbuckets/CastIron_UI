"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleTX = function (_React$Component) {
    _inherits(SingleTX, _React$Component);

    function SingleTX(props) {
        _classCallCheck(this, SingleTX);

        var _this = _possibleConstructorReturn(this, (SingleTX.__proto__ || Object.getPrototypeOf(SingleTX)).call(this, props));

        _this.onFormSubmit = _this.onFormSubmit.bind(_this);
        return _this;
    }

    _createClass(SingleTX, [{
        key: "onFormSubmit",
        value: function onFormSubmit(e) {
            e.preventDefault();
            var addr = e.target.elements.addr.value.trim();
            var amount = e.target.elements.amount.value.trim();
            var gasNumber = e.target.elements.gasNumber.value.trim();
            if (this.props.actionName == "Send") {
                this.props.sendTX(addr, amount, gasNumber);
            } else if (this.props.actionName == "Enqueue") {
                var tx = {};
                tx.from = this.props.selected_account.addr;
                tx.addr = addr;
                tx.amount = amount;
                tx.gasNumber = gasNumber;
                this.props.handleEnqueue(tx);
            }
        }
    }, {
        key: "render",
        value: function render() {

            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    "form",
                    { "class": "txForm", onSubmit: this.onFormSubmit },
                    _react2.default.createElement(
                        "label",
                        null,
                        " Address:"
                    ),
                    _react2.default.createElement("input", { type: "text", name: "addr" }),
                    _react2.default.createElement(
                        "label",
                        null,
                        " Amount:"
                    ),
                    _react2.default.createElement("input", { type: "text", name: "amount" }),
                    _react2.default.createElement(
                        "label",
                        null,
                        " Gas:"
                    ),
                    _react2.default.createElement("input", { type: "text", name: "gasNumber" }),
                    _react2.default.createElement(
                        "button",
                        null,
                        " ",
                        this.props.actionName,
                        " "
                    )
                )
            );
        }
    }]);

    return SingleTX;
}(_react2.default.Component);

exports.default = SingleTX;