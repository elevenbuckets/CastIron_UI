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

var SellOrder = function (_React$Component) {
    _inherits(SellOrder, _React$Component);

    function SellOrder(props) {
        _classCallCheck(this, SellOrder);

        return _possibleConstructorReturn(this, (SellOrder.__proto__ || Object.getPrototypeOf(SellOrder)).call(this, props));
    }

    _createClass(SellOrder, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { style: { padding: "50px 139px 70px 139px" } },
                _react2.default.createElement(
                    "table",
                    { className: "balance-sheet" },
                    _react2.default.createElement(
                        "tbody",
                        null,
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet" },
                            _react2.default.createElement(
                                "td",
                                { className: "txform", rowSpan: "300", style: { minWidth: "300px", padding: "10px" } },
                                _react2.default.createElement(
                                    "table",
                                    { className: "txform" },
                                    _react2.default.createElement(
                                        "tbody",
                                        null,
                                        _react2.default.createElement(
                                            "tr",
                                            { className: "txform" },
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform", style: { backgroundColor: '#eeeeee' } },
                                                "Symbol:"
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform" },
                                                this.props.symbol
                                            )
                                        ),
                                        _react2.default.createElement(
                                            "tr",
                                            { className: "txform" },
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform", style: { backgroundColor: '#eeeeee' } },
                                                "Name:"
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform" },
                                                this.props.tokenName
                                            )
                                        ),
                                        _react2.default.createElement(
                                            "tr",
                                            { className: "txform" },
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform", style: { backgroundColor: '#eeeeee' } },
                                                "Decimals:"
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform" },
                                                this.props.decimals
                                            )
                                        ),
                                        _react2.default.createElement(
                                            "tr",
                                            { className: "txform" },
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform", style: { backgroundColor: '#eeeeee' } },
                                                "Logo:"
                                            ),
                                            _react2.default.createElement(
                                                "td",
                                                { className: "txform", style: { textAlign: 'center' } },
                                                _react2.default.createElement(
                                                    "div",
                                                    { style: { border: "1px solid #eeeeee", display: 'inline-block', padding: "0px", textAlign: 'center' } },
                                                    _react2.default.createElement("img", { src: "assets/token_default.png", style: { width: '96px', height: '96px' } })
                                                )
                                            )
                                        )
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet", colSpan: "2" },
                                this.props.sellOrder ? "Order Size : " + this.props.sellOrder["amount"] + ", Price : " + this.props.sellOrder["price"] + ", Total: " + (this.props.sellOrder["amount"] * this.props.sellOrder["price"]).toFixed(6) : "--"
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet", hidden: this.props.disableCreateOrder, style: { marginBottom: "80px" } },
                            _react2.default.createElement(
                                "td",
                                { className: "txform", width: "73%" },
                                "Amount",
                                _react2.default.createElement("br", null),
                                _react2.default.createElement(
                                    "div",
                                    { style: { textAlign: 'center', marginLeft: '30px', marginBottom: '20px' } },
                                    _react2.default.createElement("input", { type: "text", size: "42", onChange: this.props.handleChangeAmount })
                                )
                            ),
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet", rowSpan: "2", style: { padding: "92px" } },
                                " ",
                                _react2.default.createElement("input", { type: "button", className: "button", value: "Create",
                                    disabled: this.props.disableCreateOrder, onClick: this.props.createOrder })
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet", hidden: this.props.disableCreateOrder },
                            _react2.default.createElement(
                                "td",
                                { className: "txform", width: "73%" },
                                "Price",
                                _react2.default.createElement("br", null),
                                _react2.default.createElement(
                                    "div",
                                    { style: { textAlign: 'center', marginLeft: '30px', marginBottom: '20px' } },
                                    _react2.default.createElement("input", { type: "text", size: "42",
                                        onChange: this.props.handleChangePrice })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet", hidden: !this.props.disableCreateOrder },
                            _react2.default.createElement(
                                "td",
                                { className: "txform", width: "73%" },
                                "Price ",
                                _react2.default.createElement("br", null),
                                _react2.default.createElement(
                                    "div",
                                    { style: { textAlign: 'center', marginLeft: '30px', marginBottom: '20px' } },
                                    _react2.default.createElement("input", { type: "text", size: "42", onChange: this.props.handleChangePrice })
                                )
                            ),
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet" },
                                " ",
                                _react2.default.createElement("input", { type: "button", className: "button", value: "Change Price",
                                    disabled: this.props.disableChangePrice, onClick: this.props.changePrice })
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet", hidden: !this.props.disableCreateOrder },
                            _react2.default.createElement(
                                "td",
                                { className: "txform", width: "73%" },
                                "Amount ",
                                _react2.default.createElement("br", null),
                                _react2.default.createElement(
                                    "div",
                                    { style: { textAlign: 'center', marginLeft: '30px', marginBottom: '20px' } },
                                    _react2.default.createElement("input", { type: "text", size: "42", onChange: this.props.handleChangeAmount })
                                )
                            ),
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet", style: { background: "#ffffff" } },
                                " ",
                                _react2.default.createElement("input", { type: "button", style: { width: "130px" }, className: "button", value: "Restock",
                                    disabled: this.props.disableRestock, onClick: this.props.restock })
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet", hidden: !this.props.disableCreateOrder },
                            _react2.default.createElement(
                                "td",
                                { className: "balance-sheet", colSpan: "2" },
                                " ",
                                _react2.default.createElement("input", { type: "button", style: { margin: '10px' }, className: "button", value: "Cancel",
                                    disabled: this.props.disableCancelOrder, onClick: this.props.cancelOrder })
                            )
                        )
                    )
                )
            );
        }
    }]);

    return SellOrder;
}(_react2.default.Component);

exports.default = SellOrder;