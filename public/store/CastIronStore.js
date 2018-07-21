'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _AcctMgrService = require('../service/AcctMgrService');

var _AcctMgrService2 = _interopRequireDefault(_AcctMgrService);

var _Utils = require('../util/Utils');

var _BlockTimer = require('../util/BlockTimer');

var _BlockTimer2 = _interopRequireDefault(_BlockTimer);

var _Scheduler = require('../util/Scheduler');

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CastIronStore = function (_Reflux$Store) {
    _inherits(CastIronStore, _Reflux$Store);

    function CastIronStore() {
        _classCallCheck(this, CastIronStore);

        var _this = _possibleConstructorReturn(this, (CastIronStore.__proto__ || Object.getPrototypeOf(CastIronStore)).call(this));

        _this.processQPromise = function (qPromise) {
            qPromise.then(function (Q) {
                // CastIronService.addQ(Q);
                _CastIronActions2.default.addQ(Q);
                try {
                    var r = {
                        Q: Q,
                        data: _this.wallet.rcdQ[Q]

                    };
                    _CastIronActions2.default.updateReceipts(r);
                    var batchTxHash = _this.wallet.rcdQ[Q].map(function (o) {
                        return o.tx;
                    });
                    console.log("Sending batch txs:");
                    console.log(_this.state.queuedTxs);
                    console.log(batchTxHash);
                    return _this.wallet.getReceipt(batchTxHash, 11000).then(function (data) {
                        return { data: data, Q: Q };
                    });
                } catch (err) {
                    console.log("ERROR in processQPromise: " + err);
                    console.log("rcdQ: " + Q + ">>");
                    console.log(JSON.stringify(_this.wallet.rcdQ[Q]));
                    console.log("jobQ: " + Q + ">>");
                    console.log(JSON.stringify(_this.wallet.jobQ[Q]));
                    return Promise.resolve([]);
                }
            }).then(function (r) {
                console.log("Receipts:");
                console.log(r.data);
                _CastIronActions2.default.updateReceipts(r);
            });
        };

        _this.processQReadPromise = function (qPromise) {
            qPromise.then(function (Q) {
                // CastIronService.addQ(Q);
                _CastIronActions2.default.addQ(Q);
                try {
                    var r = {
                        Q: Q,
                        data: _this.wallet.rcdQ[Q]

                    };
                    _CastIronActions2.default.updateReceipts(r);
                    var batchTxHash = _this.wallet.rcdQ[Q].map(function (o) {
                        return o.tx;
                    });
                    console.log("Sending batch txs:");
                    console.log(_this.state.queuedTxs);
                    console.log(batchTxHash);
                    return _this.wallet.getReceipt(batchTxHash, 30000).then(function (data) {
                        return { data: data, Q: Q };
                    });
                } catch (err) {
                    console.log("ERROR in processQPromise: " + err);
                    console.log("rcdQ: " + Q + ">>");
                    console.log(JSON.stringify(_this.wallet.rcdQ[Q]));
                    console.log("jobQ: " + Q + ">>");
                    console.log(JSON.stringify(_this.wallet.jobQ[Q]));
                    return Promise.resolve([]);
                }
            }).then(function (r) {
                console.log("Receipts:");
                console.log(r.data);
                _CastIronActions2.default.updateReceipts(r);
            });
        };

        _this.updateInfo = function () {
            _this.getAccounts();

            _this.wallet.gasPriceEst().then(function (data) {
                if (_this.state.gasPriceOption != "custom") {
                    var gasPrice = _this.wallet.toEth(data[_this.state.gasPriceOption], 9).toString();
                    _this.wallet.gasPrice = data[_this.state.gasPriceOption];
                    _this.setState({ blockHeight: _BlockTimer2.default.state.blockHeight, blockTime: _BlockTimer2.default.state.blockTime, gasPrice: gasPrice });
                } else {
                    if (_this.state.customGasPrice) {
                        _this.wallet.gasPrice = _this.wallet.toWei(_this.state.customGasPrice, 9);
                    }
                    _this.setState({ blockHeight: _BlockTimer2.default.state.blockHeight, blockTime: _BlockTimer2.default.state.blockTime, gasPrice: _this.state.customGasPrice });
                }
            }, function (error) {
                var gasPrice = _this.wallet.toEth(_this.wallet.configs.defaultGasPrice, 9).toString();
                _this.wallet.gasPrice = _this.wallet.configs.defaultGasPrice;
                _this.setState(function () {
                    return { blockHeight: _BlockTimer2.default.state.blockHeight, blockTime: _BlockTimer2.default.state.blockTime, gasPrice: gasPrice };
                });
            });
        };

        _this.confirmTxs = function (func, args, afterConfirmFunc, afterConfirmArgs) {
            _this.setState({ modalIsOpen: true });
            _this.funcToConfirm = func;
            _this.argsToConfirm = args;
            _this.funcAfterConfirmTx = afterConfirmFunc;
            _this.argsAfterConfirmTx = afterConfirmArgs;
        };

        _this.setUpSchedule = function (func, args, afterConfirmFunc, afterConfirmArgs) {
            _this.setState({ scheduleModalIsOpen: true });
            _this.funcToScheudle = func;
            _this.argsToSchedule = args;
            _this.funcAfterConfirmSchedule = afterConfirmFunc;
            _this.argsAfterConfirmSchedule = afterConfirmArgs;
        };

        _this.state = {
            accounts: {},

            queuedTxs: [],
            scheduleQueuedTxs: [],
            Qs: [],
            scheduledQs: [],
            finishedQs: [],
            receipts: {},
            address: null,
            balances: { 'ETH': 0 },
            blockHeight: null,
            blockTime: null,
            gasPrice: null,
            selected_token_name: '',
            currentView: 'Transfer',
            modalIsOpen: false,
            scheduleModalIsOpen: false,
            unlocked: false,
            gasPriceOption: "high",
            customGasPrice: null
        };
        _this.funcToConfirm = null;
        _this.listenables = _CastIronActions2.default;
        _this.wallet = _CastIronService2.default.wallet;
        _this.accMgr = _AcctMgrService2.default.accMgr;
        _this.getAccounts = _this.getAccounts.bind(_this);
        _this.state.tokenList = _this.wallet.configs.watchTokens || ['OMG'];
        _this.wallet.hotGroups(_this.state.tokenList);
        _this._count;
        _this._target;

        // initialize the state
        // this.getAccounts();
        _BlockTimer2.default.register(_this.updateInfo);
        _this.updateInfo();
        return _this;
    }

    _createClass(CastIronStore, [{
        key: 'onEnqueue',
        value: function onEnqueue(tx) {
            this.state.queuedTxs.push(tx);
            // TODO: figure out why can not use function for this as it will update it multiple times

            this.setState({ queuedTxs: this.state.queuedTxs });
        }
    }, {
        key: 'onEnqueueSchedule',
        value: function onEnqueueSchedule(tx) {
            this.state.scheduleQueuedTxs.push(tx);
            this.setState({ scheduleQueuedTxs: this.state.scheduleQueuedTxs });
        }
    }, {
        key: 'onDequeue',
        value: function onDequeue(tx) {
            if (this.state.queuedTxs.indexOf(tx) == -1) {
                return;
            }
            // this.setState((preState) => {
            //     preState.queuedTxs.splice(preState.queuedTxs.indexOf(tx), 1);
            //     return { queuedTxs: preState.queuedTxs }; this.setState({ modalIsOpen: true });
            // })
            this.state.queuedTxs.splice(this.state.queuedTxs.indexOf(tx), 1);
            this.setState({ queuedTxs: this.state.queuedTxs });
        }
    }, {
        key: 'onDequeueSchedule',
        value: function onDequeueSchedule(tx) {
            if (this.state.scheduleQueuedTxs.indexOf(tx) == -1) {
                return;
            }
            this.state.scheduleQueuedTxs.splice(this.state.scheduleQueuedTxs.indexOf(tx), 1);
            this.setState({ scheduleQueuedTxs: this.state.scheduleQueuedTxs });
        }
    }, {
        key: 'onClearQueue',
        value: function onClearQueue() {
            this.setState({ queuedTxs: [] });
        }
    }, {
        key: 'onClearQueueSchedule',
        value: function onClearQueueSchedule() {
            this.setState({ scheduleQueuedTxs: [] });
        }
    }, {
        key: 'onSend',
        value: function onSend(fromAddr, addr, type, amount, gasNumber) {
            this.confirmTxs(this.send, arguments);
        }
    }, {
        key: 'send',
        value: function send(fromAddr, addr, type, amount, gasNumber) {
            var wallet = _CastIronService2.default.wallet;
            wallet.setAccount(fromAddr);
            var weiAmount = wallet.toWei(amount, wallet.TokenList[type].decimals).toString();
            var jobList = [];
            jobList.push(wallet.enqueueTx(type)(addr, weiAmount, gasNumber));
            var qPromise = wallet.processJobs(jobList);
            this.processQPromise(qPromise);
        }
    }, {
        key: 'onSchedule',
        value: function onSchedule(fromAddr, addr, type, amount, gasNumber) {
            var tx = { from: fromAddr, to: addr, type: type, amount: amount, gas: gasNumber };
            this.setUpSchedule(this.batchSend.bind(this), [[tx]]);
        }
    }, {
        key: 'onScheduleTxInQueue',
        value: function onScheduleTxInQueue(tx) {
            this.setUpSchedule(this.batchSend.bind(this), [[tx]], _CastIronActions2.default.dequeueSchedule, arguments);
        }
    }, {
        key: 'onSendTxInQueue',
        value: function onSendTxInQueue(tx) {
            this.confirmTxs(this.sendTxInQueue, arguments);
        }
    }, {
        key: 'sendTxInQueue',
        value: function sendTxInQueue(tx) {
            _CastIronActions2.default.dequeue(tx);
            var wallet = _CastIronService2.default.wallet;
            wallet.setAccount(tx.from);
            var weiAmount = wallet.toWei(tx.amount, wallet.TokenList[tx.type].decimals).toString();
            var jobList = [];
            jobList.push(wallet.enqueueTx(tx.type)(tx.to, weiAmount, tx.gas));
            var qPromise = wallet.processJobs(jobList);
            this.processQPromise(qPromise);
        }
    }, {
        key: 'onSendTk',
        value: function onSendTk(tk) {
            this.confirmTxs(this.sendTk, arguments);
        }
    }, {
        key: 'sendTk',
        value: function sendTk(tk) {
            var wallet = _CastIronService2.default.wallet;
            wallet.setAccount(this.state.address);

            var jobList = [];
            jobList.push(this.wallet.enqueueTk(tk.type, tk.contract, tk.call, tk.args)(tk.txObj.value, tk.txObj.gas, tk.tkObj));
            var qPromise = wallet.processJobs(jobList);
            this.processQPromise(qPromise);
        }
    }, {
        key: 'onSendTks',
        value: function onSendTks(tks) {
            this.confirmTxs(this.sendTks, arguments);
        }
    }, {
        key: 'sendTks',
        value: function sendTks(tks) {
            var _this2 = this;

            var wallet = _CastIronService2.default.wallet;
            wallet.setAccount(this.state.address);
            var gasPrice = this.wallet.gasPrice;
            var length = tks.length;
            var jobList = tks.map(function (tk, index) {
                _this2.wallet.gasPrice = _this2.wallet.web3.toBigNumber(gasPrice).add(_this2.wallet.web3.toBigNumber(length - 1 - index).mul(1000000000));
                return _this2.wallet.enqueueTk(tk.type, tk.contract, tk.call, tk.args)(tk.txObj.value, tk.txObj.gas, tk.tkObj);
            });

            var qPromise = wallet.processJobs(jobList);
            this.processQPromise(qPromise);
        }
    }, {
        key: 'onBatchSend',
        value: function onBatchSend() {
            this.confirmTxs(this.batchSend, [this.state.queuedTxs], _CastIronActions2.default.clearQueue, arguments);
        }
    }, {
        key: 'onBatchSchedule',
        value: function onBatchSchedule() {
            this.setUpSchedule(this.batchSend.bind(this), [this.state.scheduleQueuedTxs], _CastIronActions2.default.clearQueueSchedule, arguments);
        }
    }, {
        key: 'batchSend',
        value: function batchSend(queuedTxs) {
            var wallet = _CastIronService2.default.wallet;
            var jobList = [];
            queuedTxs.map(function (tx) {
                wallet.setAccount(tx.from);
                var weiAmount = wallet.toWei(tx.amount, wallet.TokenList[tx.type].decimals).toString();
                jobList.push(wallet.enqueueTx(tx.type)(tx.to, weiAmount, tx.gas));
            });

            var qPromise = wallet.processJobs(jobList);
            this.processQPromise(qPromise);
        }
    }, {
        key: 'onSelectAccount',
        value: function onSelectAccount(value) {
            this.setState(function () {
                return { address: JSON.parse(value.value) };
            });
        }
    }, {
        key: 'onMasterUpdate',
        value: function onMasterUpdate(value) {
            var _this3 = this;

            this.wallet.password(value);
            this.accMgr.password(value);
            this.wallet.validPass().then(function (r) {
                _this3.setState({ unlocked: r });
            });
        }
    }, {
        key: 'onSelectedTokenUpdate',
        value: function onSelectedTokenUpdate(value) {
            console.log("in On onSelectedTokenUpdate");
            this.setState({ selected_token_name: value });
        }
    }, {
        key: 'onStartUpdate',
        value: function onStartUpdate(address, canvas) {
            var _this4 = this;

            this._count = 0;
            this._target = this.state.tokenList.length + 1;

            this.wallet.setAccount(address);
            //this.setState({ address: address, selected_token_name: '' });
            this.setState({ address: address });

            this.state.tokenList.map(function (t) {
                _CastIronActions2.default.statusUpdate(_defineProperty({}, t, Number(_this4.wallet.toEth(_this4.wallet.addrTokenBalance(t)(_this4.wallet.userWallet), _this4.wallet.TokenList[t].decimals).toFixed(9))));
            });

            _CastIronActions2.default.statusUpdate({ 'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) });

            (0, _Utils.createCanvasWithAddress)(canvas, this.state.address);
            //CastIronActions.changeView('Transfer');
        }
    }, {
        key: 'onAddressUpdate',
        value: function onAddressUpdate(address, canvas) {
            var _this5 = this;

            this._count = 0;
            this._target = this.state.tokenList.length + 1;
            this.wallet.setAccount(address);
            this.setState({ address: address });
            this.state.tokenList.map(function (t) {
                _CastIronActions2.default.statusUpdate(_defineProperty({}, t, Number(_this5.wallet.toEth(_this5.wallet.addrTokenBalance(t)(_this5.wallet.userWallet), _this5.wallet.TokenList[t].decimals).toFixed(9))));
            });

            _CastIronActions2.default.statusUpdate({ 'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) });
            (0, _Utils.createCanvasWithAddress)(canvas, this.state.address);
        }
    }, {
        key: 'onStatusUpdate',
        value: function onStatusUpdate(status) {
            this._count++;

            this.setState({ balances: _extends({}, this.state.balances, status) });

            if (this._count == this._target) _CastIronActions2.default.finishUpdate();
        }
    }, {
        key: 'onInfoUpdate',
        value: function onInfoUpdate(blockHeight, blockTime) {
            var _this6 = this;

            this.getAccounts();

            this.wallet.gasPriceEst().then(function (data) {
                var gasPrice = _this6.wallet.toEth(data.fast, 9).toString();
                _this6.setState({ blockHeight: blockHeight, blockTime: blockTime, gasPrice: gasPrice });
            }, function (error) {
                var gasPrice = _this6.wallet.toEth(_this6.wallet.configs.defaultGasPrice, 9).toString();
                _this6.setState({ blockHeight: blockHeight, blockTime: blockTime, gasPricconfirmTXe: gasPrice });
            });
        }
    }, {
        key: 'onFinishUpdate',
        value: function onFinishUpdate() {
            console.log('-|| Account: ' + this.state.address + ' ||-');
            console.log(JSON.stringify(this.state.balances, 0, 2));
            console.log('--------------------');
            // we can perhaps store a copy of the state o CastIronActions.clearQueue();n disk?
        }
    }, {
        key: 'onAddQ',
        value: function onAddQ(Q) {
            this.setState({ Qs: [].concat(_toConsumableArray(this.state.Qs), [Q]) });
        }
    }, {
        key: 'onChangeView',
        value: function onChangeView(view) {
            this.setState({ currentView: view });
        }
    }, {
        key: 'onUpdateReceipts',
        value: function onUpdateReceipts(r) {
            var data = r.data;
            if (typeof this.state.receipts[r.Q] !== "undefined") {
                data = this.merge(["transactionHash", "tx"], r.data, this.wallet.rcdQ[r.Q]);
            }

            data.map(function (d) {
                if (!d.tx) {
                    d.tx = "0x0000000000000000000000000000000000000000000000000000000000000000";
                }
            });

            this.setState({ receipts: _extends({}, this.state.receipts, _defineProperty({}, r.Q, data)) });
        }
    }, {
        key: 'onGasPriceOptionSelect',
        value: function onGasPriceOptionSelect(option) {
            var _this7 = this;

            var stage = Promise.resolve(this.setState({ gasPriceOption: option }));
            stage.then(function () {
                _this7.updateInfo();
            });
        }
    }, {
        key: 'onCustomGasPriceUpdate',
        value: function onCustomGasPriceUpdate(price) {
            var _this8 = this;

            var stage = Promise.resolve(this.setState({ customGasPrice: price }));
            stage.then(function () {
                _this8.updateInfo();
            });
        }
    }, {
        key: 'getAccounts',
        value: function getAccounts() {
            var _this9 = this;

            var addrs = _CastIronService2.default.getAccounts();
            var accounts = {};
            addrs.map(function (addr, index) {
                return accounts[addr] = {
                    name: "account_" + index,
                    balance: _this9.wallet.toEth(_this9.wallet.addrEtherBalance(addr), _this9.wallet.TokenList['ETH'].decimals).toFixed(9)
                };
            });

            if (this.state.address) {
                this.setState(function () {
                    return { accounts: accounts, balances: { 'ETH': accounts[_this9.state.address].balance } };
                });
                this.state.tokenList.map(function (t) {
                    _CastIronActions2.default.statusUpdate(_defineProperty({}, t, Number(_this9.wallet.toEth(_this9.wallet.addrTokenBalance(t)(_this9.wallet.userWallet), _this9.wallet.TokenList[t].decimals).toFixed(9))));
                });

                _CastIronActions2.default.statusUpdate({ 'ETH': Number(this.wallet.toEth(this.wallet.addrEtherBalance(this.wallet.userWallet), this.wallet.TokenList['ETH'].decimals).toFixed(9)) });
            } else {
                this.setState({ accounts: accounts });
            }

            console.log(JSON.stringify(this.state, 0, 2));
        }
    }, {
        key: 'onConfirmTx',


        // to confirm tx in modal
        value: function onConfirmTx() {
            this.setState({ modalIsOpen: false });
            if (this.funcToConfirm) {
                this.funcToConfirm.apply(this, _toConsumableArray(this.argsToConfirm));
                this.funcToConfirm = null;
                this.argsToConfirm = [];
            }

            if (this.funcAfterConfirmTx) {
                this.funcAfterConfirmTx.apply(this, _toConsumableArray(this.argsAfterConfirmTx));
                this.funcAfterConfirmTx = null;
                this.argsAfterConfirmTx = [];
            }
        }

        // to cancel tx in modal

    }, {
        key: 'onCancelTx',
        value: function onCancelTx() {
            this.setState({ modalIsOpen: false });
            this.funcToConfirm = null;
            this.argsToConfirm = [];
        }

        // Open confirm modal for tx sending

    }, {
        key: 'onConfirmScheduleTx',


        // to confirm schedule tx in modal
        value: function onConfirmScheduleTx(queue) {

            this.setState({ scheduleModalIsOpen: false });
            if (this.funcToScheudle) {
                var Qid = (0, _v2.default)();
                queue.Qid = Qid;
                queue.func = this.funcToScheudle;
                queue.args = this.argsToSchedule;
                queue.status = "Scheduled";
                var __queue = _extends({}, queue);
                _Scheduler2.default.schedule(__queue);

                this.state.scheduledQs.push(__queue);
                this.setState({ scheduledQs: this.state.scheduledQs });
                this.funcToScheudle = null;
                this.argsToSchedule = [];
            }

            if (this.funcAfterConfirmSchedule) {
                this.funcAfterConfirmSchedule.apply(this, _toConsumableArray(this.argsAfterConfirmSchedule));
                this.funcAfterConfirmSchedule = null;
                this.argsAfterConfirmSchedule = [];
            }
        }

        // to cancel schedule tx in modal

    }, {
        key: 'onCancelScheduleTx',
        value: function onCancelScheduleTx() {
            this.setState({ scheduleModalIsOpen: false });
            this.funcToScheudle = null;
            this.argsToSchedule = [];
        }

        // Open Schedular modal for tx sending

    }, {
        key: 'onDeleteScheduledQ',
        value: function onDeleteScheduledQ(Q) {
            if (this.state.scheduledQs.indexOf(Q) != -1) {
                this.state.scheduledQs.splice(this.state.scheduledQs.indexOf(Q), 1);
            }
            this.setState({ scheduledQs: this.state.scheduledQs });
        }
    }, {
        key: 'onDeleteScheduledQs',
        value: function onDeleteScheduledQs(Qs) {
            var _this10 = this;

            Qs.map(function (Q) {
                if (_this10.state.scheduledQs.indexOf(Q) != -1) {
                    _this10.state.scheduledQs.splice(_this10.state.scheduledQs.indexOf(Q), 1);
                }
            });

            this.setState({ scheduledQs: this.state.scheduledQs });
        }
    }, {
        key: 'merge',
        value: function merge(keys, receipt, rcdq) {
            var oout = [];
            rcdq.map(function (rc) {
                receipt.map(function (o) {
                    if (o[keys[0]] === rc[keys[1]]) oout = [].concat(_toConsumableArray(oout), [_extends({}, rc, o)]);
                });
            });
            return oout;
        }
    }, {
        key: 'render',
        value: function render() {
            React.createElement('canvas', { ref: 'canvas', width: 66, height: 66, style: {
                    border: "3px solid #ccc",
                    borderBottomLeftRadius: "2.8em",
                    borderBottomRightRadius: "2.8em",
                    borderTopRightRadius: "2.8em",
                    borderTopLeftRadius: "2.8em"
                }
            });
        }
    }]);

    return CastIronStore;
}(_reflux2.default.Store);

CastIronStore.id = "CastIronStore";

exports.default = CastIronStore;