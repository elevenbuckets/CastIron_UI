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

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Reflux components

var TxQList = function (_Reflux$Component) {
  _inherits(TxQList, _Reflux$Component);

  function TxQList(props) {
    _classCallCheck(this, TxQList);

    var _this = _possibleConstructorReturn(this, (TxQList.__proto__ || Object.getPrototypeOf(TxQList)).call(this, props));

    _this.render = function () {
      if (_this.state.address == '') return _react2.default.createElement('p', null);

      var tokenBalances = [];
      var tokenkinds = 0;
      _this.state.tokenList.map(function (t) {
        tokenBalances.push(t + ': ' + _this.state.balances[t]);
        if (_this.state.balances[t] > 0) tokenkinds++;
      });

      return _react2.default.createElement(
        'div',
        { style: { overflow: 'scroll', margin: '0', maxHeight: "430", height: '430px' } },
        _react2.default.createElement(
          'table',
          { className: 'txform' },
          _react2.default.createElement(
            'tbody',
            null,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '3%' },
                'X'
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '32%' },
                'From'
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '32%' },
                'To'
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '4%' },
                'Type'
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '10%' },
                'Amount'
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform', width: '10%' },
                'Gas Fee'
              ),
              _react2.default.createElement(
                'td',
                { className: 'txform' },
                'Actions'
              )
            ),
            _this.state.queuedTxs.map(function (tx) {
              return _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                  'td',
                  { className: 'txform', width: '5%' },
                  _react2.default.createElement('input', { type: 'button', className: 'xbutton', value: 'X',
                    onClick: _this.handleDequeue.bind(_this, tx) })
                ),
                _react2.default.createElement(
                  'td',
                  { className: 'txform', width: '32%' },
                  tx.from
                ),
                _react2.default.createElement(
                  'td',
                  { className: 'txform', width: '32%' },
                  tx.to
                ),
                _react2.default.createElement(
                  'td',
                  { className: 'txform', width: '4%' },
                  tx.type
                ),
                _react2.default.createElement(
                  'td',
                  { className: 'txform', width: '10%' },
                  tx.amount
                ),
                _react2.default.createElement(
                  'td',
                  { className: 'txform', width: '10%' },
                  tx.gas * _this.state.gasPrice
                ),
                _react2.default.createElement(
                  'td',
                  { className: 'txform' },
                  _react2.default.createElement('input', { type: 'button', className: 'button', value: 'Send',
                    onClick: _this.handSendTxInQueue.bind(_this, tx) })
                )
              );
            })
          )
        )
      );
    };

    _this.store = _CastIronStore2.default;
    return _this;
  }

  _createClass(TxQList, [{
    key: 'handleDequeue',
    value: function handleDequeue(tx, event) {
      _CastIronActions2.default.dequeue(tx);
    }
  }, {
    key: 'handSendTxInQueue',
    value: function handSendTxInQueue(tx, event) {
      _CastIronActions2.default.sendTxInQueue(tx);
      event.target.blur();
    }
  }]);

  return TxQList;
}(_reflux2.default.Component);

exports.default = TxQList;