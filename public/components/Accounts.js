'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Account = require('./Account');

var _Account2 = _interopRequireDefault(_Account);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

require('react-dropdown/style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Accounts = function (_React$Component) {
    _inherits(Accounts, _React$Component);

    function Accounts(props) {
        _classCallCheck(this, Accounts);

        var _this = _possibleConstructorReturn(this, (Accounts.__proto__ || Object.getPrototypeOf(Accounts)).call(this, props));

        _this.state = {
            showAllAcounts: false
        };
        _this.handleClick = _this.handleClick.bind(_this);

        return _this;
    }

    _createClass(Accounts, [{
        key: 'handleClick',
        value: function handleClick() {
            this.setState(function (preState) {
                var state = preState;
                state.showAllAcounts = !preState.showAllAcounts;
                return state;
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var options = Object.keys(this.props.accounts);

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_reactDropdown2.default, { options: options, onChange: this.props._onSelect, value: JSON.stringify(this.state.selected_account), placeholder: 'Select an option' }),
                _react2.default.createElement(
                    'p',
                    null,
                    'The account selected is : ',
                    JSON.stringify(this.props.selected_account)
                ),
                _react2.default.createElement(
                    'button',
                    { onClick: this.handleClick },
                    this.state.showAllAcounts ? "Hide All Accounts" : "Show All Accounts"
                ),
                this.state.showAllAcounts && _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'p',
                        null,
                        'These are the accounts and balnaces:'
                    ),
                    this.props.accounts.map(function (account, index) {
                        return _react2.default.createElement(_Account2.default, { key: index, account: account });
                    })
                )
            );
        }
    }]);

    return Accounts;
}(_react2.default.Component);

exports.default = Accounts;