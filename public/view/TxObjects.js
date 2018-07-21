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

var _AlertModalUser2 = require('../common/AlertModalUser');

var _AlertModalUser3 = _interopRequireDefault(_AlertModalUser2);

var _AlertModal = require('../components/AlertModal');

var _AlertModal2 = _interopRequireDefault(_AlertModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Reflux components

var TxObjects = function (_AlertModalUser) {
  _inherits(TxObjects, _AlertModalUser);

  function TxObjects(props) {
    _classCallCheck(this, TxObjects);

    var _this = _possibleConstructorReturn(this, (TxObjects.__proto__ || Object.getPrototypeOf(TxObjects)).call(this, props));

    _this.render = function () {
      if (_this.state.address == '') return _react2.default.createElement('p', null);

      var sendkind = _this.props.selected_token_name !== '' ? _this.props.selected_token_name : 'ETH';

      return _react2.default.createElement(
        'form',
        null,
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
                { className: 'txform', width: '14%', style: { whiteSpace: 'nowrap' } },
                'Types',
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                  'div',
                  { style: { textAlign: 'right' } },
                  sendkind
                )
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '43%' },
                'Amount',
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                  'div',
                  { style: { textAlign: 'center' } },
                  _react2.default.createElement('input', { type: 'text', size: '32', onChange: _this.handleChangeAmount })
                )
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '43%' },
                'Gas',
                _react2.default.createElement('br', null),
                _react2.default.createElement(
                  'div',
                  { style: { textAlign: 'center' } },
                  _react2.default.createElement('input', { type: 'text', size: '32', onChange: _this.handleChangeGas })
                )
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform' },
                _react2.default.createElement('input', { type: 'button', className: 'button', value: _this.props.send_button_value, onClick: _this.handleSend })
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform' },
                _react2.default.createElement('input', { type: 'button', className: 'button', value: 'Enqueue', onClick: _this.handleEnqueue })
              )
            )
          )
        ),
        _react2.default.createElement(_AlertModal2.default, { content: _this.state.alertContent, isAlertModalOpen: _this.state.isAlertModalOpen, close: _this.closeModal })
      );
    };

    _this.store = _CastIronStore2.default;
    // TODO: figure out why need this bind but Transfer.js does not 
    _this.handleChangeAmount = _this.handleChangeAmount.bind(_this);
    _this.handleChangeGas = _this.handleChangeGas.bind(_this);
    _this.handleEnqueue = _this.handleEnqueue.bind(_this);
    _this.handleSend = _this.handleSend.bind(_this);
    return _this;
  }

  _createClass(TxObjects, [{
    key: 'handleChangeAmount',
    value: function handleChangeAmount(event) {
      console.log('got event: ' + event.target.value);

      var value = event.target.value;
      if (isNaN(value)) {
        this.openModal("Please enter a number!");
        event.target.value = value.slice(0, -1);
      } else {
        var amount = event.target.value;

        console.log('got amount: ' + amount);
        this.setState(function () {
          return { amount: amount };
        });
      }
    }
  }, {
    key: 'handleChangeGas',
    value: function handleChangeGas(event) {
      console.log('got event: ' + event.target.value);

      var value = event.target.value;
      if (isNaN(value)) {
        this.openModal("Please enter a number!");
        event.target.value = value.slice(0, -1);
      } else {
        var gas = event.target.value;
        console.log('got gas: ' + gas);
        this.setState(function () {
          return { gas: gas };
        });
      }
    }
  }, {
    key: 'handleSend',
    value: function handleSend(event) {
      console.log("sending event" + event);
      var type = this.state.selected_token_name ? this.state.selected_token_name : "ETH";
      this.props.handleSend(this.props.recipient, type, this.state.amount, this.state.gas);
    }
  }, {
    key: 'handleEnqueue',
    value: function handleEnqueue() {
      var tx = {};
      tx.from = this.state.address;
      tx.to = this.props.recipient;
      tx.amount = this.state.amount;
      tx.type = this.state.selected_token_name ? this.state.selected_token_name : "ETH";
      tx.gas = this.state.gas;
      this.props.handleEnqueue(tx);
    }
  }]);

  return TxObjects;
}(_AlertModalUser3.default);

exports.default = TxObjects;