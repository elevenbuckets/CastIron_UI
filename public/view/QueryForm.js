'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDropdown = require('react-dropdown');

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

var _GenSheets = require('./GenSheets');

var _GenSheets2 = _interopRequireDefault(_GenSheets);

var _Settings = require('./Settings');

var _Settings2 = _interopRequireDefault(_Settings);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var QueryForm = function (_Reflux$Component) {
  _inherits(QueryForm, _Reflux$Component);

  function QueryForm(props) {
    _classCallCheck(this, QueryForm);

    var _this = _possibleConstructorReturn(this, (QueryForm.__proto__ || Object.getPrototypeOf(QueryForm)).call(this, props));

    _this.handleClick = function () {

      _this.toggleSettings();

      console.log("clicked");
    };

    _this.isCustomGasPriceValid = function () {
      return _this.state.gasPriceOption != "custom" || _this.state.customGasPrice;
    };

    _this.toggleSettings = function () {
      _this.setState({ visible: !_this.state.visible });
    };

    _this.handleChange = function (event) {
      _CastIronActions2.default.startUpdate(event.value, _this.refs.canvas);
    };

    _this.handleToggle = function (event) {
      var pt = !_this.state.ptoggle;
      var sb = pt ? 'none' : 'inline-block';
      var pf = pt ? '100px' : '283px';
      _this.setState({ ptoggle: pt, pfield: pf, sbutton: sb });
      _CastIronActions2.default.masterUpdate(_this.refs.mp.value);
    };

    _this.handleGasPriceSelect = function (event) {
      _CastIronActions2.default.gasPriceOptionSelect(event.currentTarget.defaultValue);
    };

    _this.handleCustomGasPriceUpdate = function (price) {
      _CastIronActions2.default.customGasPriceUpdate(price);
    };

    _this.handleEnter = function (event) {
      if (event.keyCode === 13) _CastIronActions2.default.masterUpdate(_this.refs.mp.value);
    };

    _this.copyAddress = function () {
      var dummy = document.createElement("input");
      document.body.appendChild(dummy);
      dummy.setAttribute("id", "dummy_id");
      document.getElementById("dummy_id").value = _this.state.address;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    };

    _this.render = function () {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Settings2.default, { handleClickBack: _this.handleClick, isCustomGasPrice: _this.state.gasPriceOption != "custom",
          visibility: _this.state.visible, isCustomGasPriceValid: _this.isCustomGasPriceValid,
          handleGasPriceSelect: _this.handleGasPriceSelect, handleCustomGasPriceUpdate: _this.handleCustomGasPriceUpdate }),
        _react2.default.createElement(
          'table',
          null,
          _react2.default.createElement(
            'tbody',
            null,
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'td',
                { className: 'avatar', width: 201 },
                _react2.default.createElement('canvas', { ref: 'canvas', width: 66, height: 66, style: {
                    border: "3px solid #ccc",
                    borderBottomLeftRadius: "2.8em",
                    borderBottomRightRadius: "2.8em",
                    borderTopRightRadius: "2.8em",
                    borderTopLeftRadius: "2.8em"
                  }
                })
              ),
              _react2.default.createElement(
                'td',
                { style: { padding: "0px 25px 0px 45px", margin: "0px" } },
                _react2.default.createElement(
                  'table',
                  { border: '0' },
                  _react2.default.createElement(
                    'tbody',
                    null,
                    _react2.default.createElement(
                      'tr',
                      { style: { border: '0px' }, align: 'center' },
                      _react2.default.createElement(
                        'td',
                        { style: { border: '0px', padding: '0px', width: '10px' } },
                        _react2.default.createElement(
                          'p',
                          { style: { fontWeight: 'bold', fontSize: "1.2em", display: "inline-block", margin: "0px", padding: "0px", width: "80px" } },
                          'Address:'
                        )
                      ),
                      _react2.default.createElement(
                        'td',
                        { rowSpan: '2', style: { border: '0px', padding: '0px' } },
                        _react2.default.createElement(_reactDropdown2.default, { ref: 'addrlist', id: 'mainaddr', options: Object.keys(_this.state.accounts), onChange: _this.handleChange,
                          value: _this.state.address, placeholder: "You Have " + Object.keys(_this.state.accounts).length + " Accounts" })
                      )
                    ),
                    _react2.default.createElement(
                      'tr',
                      { style: { border: '0px' }, align: 'center' },
                      _react2.default.createElement(
                        'td',
                        { style: { border: '0px', padding: '0px', width: '110px' } },
                        _react2.default.createElement('input', { style: { display: 'inline-block', padding: '2px', margin: '0px', color: '#ffffff', borderColor: '#ffffff' },
                          type: 'button', className: 'bbutton', value: 'Copy', onClick: _this.copyAddress })
                      )
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'td',
                { width: _this.state.pfield, style: { textAlign: 'center', minWidth: _this.state.pfield },
                  onMouseEnter: _this.handleToggle, onMouseLeave: _this.handleToggle },
                _react2.default.createElement(
                  'table',
                  { border: '0' },
                  _react2.default.createElement(
                    'tbody',
                    null,
                    _react2.default.createElement(
                      'tr',
                      { style: { border: '0px' }, align: 'center' },
                      _react2.default.createElement(
                        'td',
                        { style: { border: '0px', color: _this.state.unlocked ? '#4CAF50' : 'red' } },
                        _react2.default.createElement(
                          'label',
                          { style: { fontWeight: 'bold' } },
                          'Master Password'
                        ),
                        _react2.default.createElement('br', null),
                        _react2.default.createElement('input', { ref: 'mp', type: 'password', maxLength: '200', hidden: _this.state.ptoggle, style: { marginTop: '7px' }, onKeyUp: _this.handleEnter })
                      ),
                      _react2.default.createElement(
                        'td',
                        { style: { border: '0px', display: _this.state.sbutton, textAlign: "center" } },
                        _react2.default.createElement('input', { type: 'button', className: 'button', onClick: _this.handleClick, style: { marginTop: '7px' }, value: 'Settings' })
                      )
                    )
                  )
                )
              )
            ),
            _react2.default.createElement(
              'tr',
              null,
              _react2.default.createElement(
                'td',
                { colSpan: '3' },
                _react2.default.createElement(_GenSheets2.default, null)
              )
            )
          )
        )
      );
    };

    _this.store = _CastIronStore2.default;
    _this.state = {
      ptoggle: true,
      pfield: '28px',
      visible: false,
      sbutton: 'none'
    };
    return _this;
  }

  return QueryForm;
}(_reflux2.default.Component);

exports.default = QueryForm;