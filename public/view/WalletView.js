'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _SendTX = require('../components/SendTX');

var _SendTX2 = _interopRequireDefault(_SendTX);

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _Receipts = require('../components/Receipts');

var _Receipts2 = _interopRequireDefault(_Receipts);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WalletView = function (_Reflux$Component) {
    _inherits(WalletView, _Reflux$Component);

    function WalletView(props) {
        _classCallCheck(this, WalletView);

        return _possibleConstructorReturn(this, (WalletView.__proto__ || Object.getPrototypeOf(WalletView)).call(this, props));

        // this.store = CastIronStore;
        // this.wallet = CastIronService.wallet;
    }

    // _onSelect(value) {
    //    CastIronActions.selectAccount(value);
    // }

    //     handleEnqueue(tx) {
    //         // CastIronActions.enqueue(tx);
    //     }

    //     handleDequeue(tx) {
    //         CastIronActions.dequeue(tx);
    //     }

    //     handleSend(addr, amount, gasNumber) {
    //         CastIronActions.send(addr, amount, gasNumber);
    //     }

    //     handleBatchSend() {
    //         CastIronActions.batchSend();
    //     }


    //     render() {
    //         return (
    //             <div> 
    //                 <SendTX queuedTxs={this.state.queuedTxs} selected_account={this.state.selected_account}
    //                     handleEnqueue={this.handleEnqueue} handleDequeue={this.handleDequeue} handleSend={this.handleSend}
    //                     handleBatchSend={this.handleBatchSend} />
    //                 <Receipts receipts={this.state.receipts} />
    //             </div>

    //         )
    //     }

    return WalletView;
}(_reflux2.default.Component);

exports.default = WalletView;