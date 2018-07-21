'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _AlertModal = require('../components/AlertModal');

var _AlertModal2 = _interopRequireDefault(_AlertModal);

var _AlertModalUser2 = require('../common/AlertModalUser');

var _AlertModalUser3 = _interopRequireDefault(_AlertModalUser2);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _BMartService = require('../service/BMartService');

var _BMartService2 = _interopRequireDefault(_BMartService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Reflux components and Alert Modal user
var GenSheets = function (_AlertModalUser) {
  _inherits(GenSheets, _AlertModalUser);

  function GenSheets(props) {
    _classCallCheck(this, GenSheets);

    var _this = _possibleConstructorReturn(this, (GenSheets.__proto__ || Object.getPrototypeOf(GenSheets)).call(this, props));

    _this.handleChange = function (event) {
      console.log("event.value in GenSheets handleChange is " + event.value);
      var symbol = event.value.substring(0, event.value.indexOf(':'));
      _CastIronActions2.default.selectedTokenUpdate(symbol);
    };

    _this.handleClickTransactETH = function () {
      if (typeof _this.rootViews[_this.state.currentView] === 'undefined') _CastIronActions2.default.changeView("Transfer");
      _CastIronActions2.default.selectedTokenUpdate("");
      var tokenBalances = [];
      var tokenkinds = 0;
      _this.state.tokenList.map(function (t) {
        tokenBalances.push(t + ': ' + _this.state.balances[t]);
        if (_this.state.balances[t] > 0) tokenkinds++;
      });
      _this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
    };

    _this.handleClickTransact = function () {
      if (_this.state.selected_token_name === "") {
        _this.openModal("Please select a token first!");
      } else {
        _CastIronActions2.default.changeView("Transfer");
      }
    };

    _this.handleClickTrade = function () {
      if (_this.state.selected_token_name === "") {
        _this.openModal("Please select a token first!");
        var tokenBalances = [];
        var tokenkinds = 0;
        _this.state.tokenList.map(function (t) {
          if (_BMartService2.default.Registry.isListed(_CastIronService2.default.wallet.TokenList[t].addr)) {
            tokenBalances.push(t + ': ' + _this.state.balances[t]);
            tokenkinds++;
          }
        });
        _this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
      } else {
        _CastIronActions2.default.changeView("Trade");
      }
    };

    _this.render = function () {
      if (_this.state.address == '') return _react2.default.createElement('p', null);

      return _react2.default.createElement(
        'table',
        { className: 'balance-sheet' },
        _react2.default.createElement(
          'tbody',
          null,
          _react2.default.createElement(
            'tr',
            null,
            _react2.default.createElement(
              'th',
              { className: 'balance-sheet' },
              'Types'
            ),
            _react2.default.createElement(
              'th',
              { className: 'balance-sheet' },
              'Amount'
            ),
            _react2.default.createElement(
              'th',
              { className: 'balance-sheet', colSpan: '3' },
              'Actions'
            )
          ),
          _react2.default.createElement(
            'tr',
            { className: 'balance-sheet' },
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet', width: '185' },
              'ETH:'
            ),
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet', width: '35%' },
              _this.state.balances['ETH']
            ),
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet' },
              _react2.default.createElement('input', { type: 'button', className: 'button', onClick: _this.handleClickTransactETH, value: 'Transact ETH' })
            ),
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet' },
              _react2.default.createElement('input', { type: 'button', className: 'button', value: 'Trade ETH', disabled: true })
            )
          ),
          _react2.default.createElement(
            'tr',
            { className: 'balance-sheet' },
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet', width: '185' },
              'ERC20:'
            ),
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet', width: '35%' },
              _react2.default.createElement(_reactDropdown2.default, { options: _this.state.tokenBalances, onChange: _this.handleChange, value: _this.state.selected_token_name !== '' ? _this.state.selected_token_name + ': ' + _this.state.balances[_this.state.selected_token_name] : '', placeholder: 'Found ' + _this.state.tokenkinds + ' tokens' })
            ),
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet' },
              _react2.default.createElement('input', { type: 'button', className: 'button', onClick: _this.handleClickTransact, value: _this.state.selected_token_name !== '' ? "Transact " + _this.state.selected_token_name : 'Transact ...' })
            ),
            _react2.default.createElement(
              'td',
              { className: 'balance-sheet' },
              _react2.default.createElement('input', { type: 'button', className: 'button', onClick: _this.handleClickTrade,
                value: _this.state.selected_token_name !== '' ? "Trade " + _this.state.selected_token_name : 'Trade ...',
                disabled: _this.state.selected_token_name !== '' && !_BMartService2.default.Registry.isListed(_CastIronService2.default.wallet.TokenList[_this.state.selected_token_name].addr) })
            )
          )
        ),
        _react2.default.createElement(_AlertModal2.default, { content: _this.state.alertContent, isAlertModalOpen: _this.state.isAlertModalOpen, close: _this.closeModal })
      );
    };

    _this.store = _CastIronStore2.default;

    _this.state = {
      tokenBalances: [],
      tokenkinds: 0
    };

    _this.rootViews = { 'Transfer': true, 'Scheduler': true };
    return _this;
  }

  _createClass(GenSheets, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var tokenBalances = [];
      var tokenkinds = 0;

      if (this.state.address != prevState.address && this.state.address != '') {
        this.state.tokenList.map(function (t) {
          tokenBalances.push(t + ': ' + _this2.state.balances[t]);
          if (_this2.state.balances[t] > 0) tokenkinds++;
        });

        if (this.state.currentView == 'Trade') {
          tokenBalances = tokenBalances.filter(function (line) {
            var symbol = line.substring(0, line.indexOf(':'));
            return _BMartService2.default.Registry.isListed(_CastIronService2.default.wallet.TokenList[symbol].addr);
          });
        }
      }

      if (this.state.currentView != prevState.currentView && this.state.currentView == 'Trade') {
        if (tokenBalances.length == 0) {
          this.state.tokenList.map(function (t) {
            tokenBalances.push(t + ': ' + _this2.state.balances[t]);
            if (_this2.state.balances[t] > 0) tokenkinds++;
          });
        }

        tokenBalances = tokenBalances.filter(function (line) {
          var symbol = line.substring(0, line.indexOf(':'));
          return _BMartService2.default.Registry.isListed(_CastIronService2.default.wallet.TokenList[symbol].addr);
        });
        this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
      } else if (tokenBalances.length > 0) {
        this.setState({ tokenBalances: tokenBalances, tokenkinds: tokenkinds });
      }
    }
  }]);

  return GenSheets;
}(_AlertModalUser3.default);

exports.default = GenSheets;