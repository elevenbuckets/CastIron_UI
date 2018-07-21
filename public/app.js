'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouterDom = require('react-router-dom');

var _WalletView = require('./view/WalletView');

var _WalletView2 = _interopRequireDefault(_WalletView);

var _ReceiptsView = require('./view/ReceiptsView');

var _ReceiptsView2 = _interopRequireDefault(_ReceiptsView);

var _Dashboard = require('./view/Dashboard');

var _Dashboard2 = _interopRequireDefault(_Dashboard);

var _NotFound = require('./view/NotFound');

var _NotFound2 = _interopRequireDefault(_NotFound);

var _CastIronStore = require('./store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = _react2.default.createElement(
    _reactRouterDom.BrowserRouter,
    null,
    _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            _reactRouterDom.Switch,
            null,
            _react2.default.createElement(_reactRouterDom.Route, { path: '/receipts', component: _ReceiptsView2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { path: '/', component: _Dashboard2.default }),
            _react2.default.createElement(_reactRouterDom.Route, { component: _NotFound2.default })
        )
    )
);

_reactDom2.default.render(routes, document.getElementById('app'));