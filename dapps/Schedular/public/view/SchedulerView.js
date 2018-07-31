"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CastIronStore = require("../../../../public/store/CastIronStore");

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

var _CastIronService = require("../../../../public/service/CastIronService");

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _reflux = require("reflux");

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDropdown = require("react-dropdown");

var _reactDropdown2 = _interopRequireDefault(_reactDropdown);

var _CastIronActions = require("../../../../public/action/CastIronActions");

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _TxObjects = require("../../../../public/view/TxObjects");

var _TxObjects2 = _interopRequireDefault(_TxObjects);

var _TxQList = require("../../../../public/view/TxQList");

var _TxQList2 = _interopRequireDefault(_TxQList);

var _Utils = require("../../../../public/util/Utils");

var _SchedulerJob = require("../components/SchedulerJob");

var _SchedulerJob2 = _interopRequireDefault(_SchedulerJob);

var _EditScheduleTXModal = require("../../../../public/components/EditScheduleTXModal");

var _EditScheduleTXModal2 = _interopRequireDefault(_EditScheduleTXModal);

var _Scheduler = require("../../../../public/util/Scheduler");

var _Scheduler2 = _interopRequireDefault(_Scheduler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SchedulerView = function (_Reflux$Component) {
    _inherits(SchedulerView, _Reflux$Component);

    function SchedulerView(props) {
        _classCallCheck(this, SchedulerView);

        var _this = _possibleConstructorReturn(this, (SchedulerView.__proto__ || Object.getPrototypeOf(SchedulerView)).call(this, props));

        _this.componentDidMount = function () {
            (0, _Utils.setDappLocalState)(_this, { filteredQs: _this.state.scheduledQs });
        };

        _this.componnentDidUpdate = function (prevProps, prevState) {
            if (prevState.scheduledQs != _this.state.scheduledQs) {
                var filteredQs = _this.state.scheduledQs;
                var filter = _this.state.dappLocal.filter;
                // filteredQs = filteredQs.filter(q => {
                //     return JSON.stringify(q) == JSON.stringify({ ...q, ...this.state.dappLocal.filter });
                // })
                filteredQs = filteredQs.filter(function (q) {
                    return Object.keys(filter).reduce(function (match, key) {
                        return match && q[key].includes(filter[key]);
                    }, true);
                    // return JSON.stringify(q) == JSON.stringify({ ...q, ...filter });
                });
                (0, _Utils.setDappLocalState)(_this, { filteredQs: filteredQs });
            }
        };

        _this.saveScheduleTX = function (Q) {
            // Use Schedule now, need to figure out how to change from state
            _Scheduler2.default.state.Qs.map(function (q) {
                if (q.Qid == Q.Qid) {
                    Object.keys(q).map(function (key) {
                        q[key] = Q[key];
                    });
                }
            });

            _this.goTo("List");
        };

        _this.cancelChangeScheduleTX = function () {
            _this.goTo("List");
        };

        _this.goTo = function (view) {
            (0, _Utils.setDappLocalState)(_this, { schedulerViewType: view });
        };

        _this.getActiveTaskNumber = function () {
            return _this.state.dappLocal.filteredQs.length;
        };

        _this.checked = function (Q, event) {
            if (event.target.checked) {
                (0, _Utils.setDappLocalState)(_this, { selectedQs: [].concat(_toConsumableArray(_this.state.dappLocal.selectedQs), [Q]) });
            } else {
                if (_this.state.dappLocal.selectedQs.indexOf(Q) != -1) {
                    _this.state.dappLocal.selectedQs.splice(_this.state.dappLocal.selectedQs.indexOf(Q), 1);
                    (0, _Utils.setDappLocalState)(_this, { selectedQs: _this.state.dappLocal.selectedQs });
                }
            }
        };

        _this.delete = function () {
            // 
            // this.state.dappLocal.selectedQs.map(Q => {
            //     if(Scheduler.state.Qs.indexOf(Q) != -1){
            //         Scheduler.state.Qs.splice(Scheduler.state.Qs.indexOf(Q), 1);
            //         CastIronActions.deleteScheduledQ(Q);
            //     }

            // })
            var cloneQs = [].concat(_toConsumableArray(_this.state.dappLocal.selectedQs));
            _Scheduler2.default.deleteQs(cloneQs);
            _CastIronActions2.default.deleteScheduledQs(cloneQs);
            (0, _Utils.setDappLocalState)(_this, { selectedQs: [] });
        };

        _this.changeFilter = function (field, event) {
            var filter = _extends({}, _this.state.dappLocal.filter, _defineProperty({}, field, event.target.value));
            if (event.target.value == "") {
                delete filter[field];
            }
            var filteredQs = _this.state.scheduledQs;
            filteredQs = filteredQs.filter(function (q) {
                return Object.keys(filter).reduce(function (match, key) {
                    return match && q[key].includes(filter[key]);
                }, true);
                // return JSON.stringify(q) == JSON.stringify({ ...q, ...filter });
            });
            (0, _Utils.setDappLocalState)(_this, { filter: filter, filteredQs: filteredQs });
        };

        _this.toggleSearch = function () {
            (0, _Utils.setDappLocalState)(_this, { showSearch: !_this.state.dappLocal.showSearch });
        };

        _this.getQsComponent = function () {
            if (_this.state.dappLocal.filteredQs) {
                return _this.state.dappLocal.filteredQs.map(function (q) {
                    return _react2.default.createElement(
                        "tr",
                        { className: "balance-sheet" },
                        _react2.default.createElement(
                            "td",
                            { className: "balance-sheet",
                                width: "5%" },
                            _react2.default.createElement("input", {
                                name: "check",
                                type: "checkbox",
                                checked: _this.state.dappLocal.selectedQs.includes(q),
                                onChange: _this.checked.bind(_this, q),
                                style: { width: "25px", height: "25px" } })
                        ),
                        _react2.default.createElement(
                            "td",
                            { className: "balance-sheet",
                                width: "30%" },
                            q.Qid
                        ),
                        _react2.default.createElement(
                            "td",
                            { className: "balance-sheet",
                                width: "20%" },
                            q.name
                        ),
                        _react2.default.createElement(
                            "td",
                            { className: "balance-sheet",
                                width: "20%" },
                            q.trigger
                        ),
                        _react2.default.createElement(
                            "td",
                            { className: "balance-sheet",
                                width: "10%" },
                            q.target
                        ),
                        _react2.default.createElement(
                            "td",
                            { className: "balance-sheet",
                                width: "5%" },
                            q.tolerance
                        ),
                        _react2.default.createElement(
                            "td",
                            { className: "balance-sheet",
                                width: "10%" },
                            q.status
                        )
                    );
                });
            }
        };

        _this.render = function () {
            return _this.state.dappLocal.schedulerViewType != "New" ? _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    "table",
                    { className: "balance-sheet" },
                    _react2.default.createElement(
                        "tbody",
                        null,
                        _react2.default.createElement(
                            "tr",
                            { className: "avatar", style: { textAlign: "center" } },
                            _react2.default.createElement(
                                "th",
                                { colSpan: "2", className: "avatar", style: { textAlign: "center" } },
                                "Schedular"
                            )
                        ),
                        _react2.default.createElement(
                            "tr",
                            { className: "balance-sheet" },
                            _react2.default.createElement(
                                "td",
                                { className: "txform", style: { border: '0', textAlign: "left" } },
                                _react2.default.createElement("input", { type: "button", className: "bbutton", value: "New", onClick: _this.goTo.bind(_this, "New") }),
                                _react2.default.createElement("input", { type: "button", className: "bbutton", value: "Edit", onClick: _this.goTo.bind(_this, "Edit"),
                                    disabled: _this.state.dappLocal.selectedQs.length != 1 }),
                                _react2.default.createElement("input", { type: "button", className: "bbutton", value: "Search", onClick: _this.toggleSearch }),
                                _react2.default.createElement("input", { type: "button", className: "bbutton", value: "Delete", onClick: _this.delete,
                                    disabled: _this.state.dappLocal.selectedQs.length == 0 })
                            ),
                            _react2.default.createElement(
                                "td",
                                { className: "txform", style: { border: '0', textAlign: "center" } },
                                _react2.default.createElement(
                                    "p",
                                    null,
                                    "Active Tasks: ",
                                    _this.getActiveTaskNumber()
                                )
                            )
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { style: { overflow: 'scroll', margin: '0', maxHeight: "490px", height: '490px' } },
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
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "5%" },
                                    "Select"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "30%" },
                                    "Qid"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "20%" },
                                    "Name"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "20%" },
                                    "Trigger"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "10%" },
                                    "Target"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "5%" },
                                    "Tolerance"
                                ),
                                _react2.default.createElement(
                                    "th",
                                    { className: "balance-sheet", style: { color: '#111111' }, width: "10%" },
                                    "Status"
                                )
                            ),
                            _react2.default.createElement(
                                "tr",
                                { className: "balance-sheet", style: { textAlign: "center" } },
                                _react2.default.createElement(
                                    "th",
                                    { colSpan: "7", className: "balance-sheet", style: { textAlign: "center" }, hidden: "true" },
                                    "Color Swap"
                                )
                            ),
                            _react2.default.createElement(
                                "tr",
                                { className: "balance-sheet", hidden: !_this.state.dappLocal.showSearch },
                                _react2.default.createElement("td", { className: "balance-sheet",
                                    width: "5%" }),
                                _react2.default.createElement(
                                    "td",
                                    { className: "balance-sheet",
                                        width: "30%" },
                                    _react2.default.createElement("input", { type: "text", size: "36",
                                        onChange: _this.changeFilter.bind(_this, "Qid")
                                    })
                                ),
                                _react2.default.createElement(
                                    "td",
                                    { className: "balance-sheet",
                                        width: "20%" },
                                    _react2.default.createElement("input", { type: "text", size: "20",
                                        onChange: _this.changeFilter.bind(_this, "name")
                                    })
                                ),
                                _react2.default.createElement(
                                    "td",
                                    { className: "balance-sheet",
                                        width: "20%" },
                                    _react2.default.createElement("input", { type: "text", size: "20",
                                        onChange: _this.changeFilter.bind(_this, "trigger")
                                    })
                                ),
                                _react2.default.createElement(
                                    "td",
                                    { className: "balance-sheet",
                                        width: "10%" },
                                    _react2.default.createElement("input", { type: "text", size: "10",
                                        onChange: _this.changeFilter.bind(_this, "target")
                                    })
                                ),
                                _react2.default.createElement(
                                    "td",
                                    { className: "balance-sheet",
                                        width: "5%" },
                                    _react2.default.createElement("input", { type: "text", size: "5",
                                        onChange: _this.changeFilter.bind(_this, "tolerance")
                                    })
                                ),
                                _react2.default.createElement(
                                    "td",
                                    { className: "balance-sheet",
                                        width: "10%" },
                                    _react2.default.createElement("input", { type: "text", size: "10",
                                        onChange: _this.changeFilter.bind(_this, "status")
                                    })
                                )
                            ),
                            _this.getQsComponent()
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { style: {
                                textAlign: 'center',
                                backgroundColor: '#ffffff',
                                width: '99.5%',
                                maxHeight: '58',
                                minHeight: '58',
                                zIndex: '2',
                                position: "fixed",
                                bottom: '20%',
                                boxShadow: '0 -5px 6px -5px rgba(200,200,200,0.5)'
                            } },
                        _react2.default.createElement("input", { type: "text", style: { paddingTop: '15px', fontFamily: 'monospace', border: 0, width: '85%', fontSize: '1.11em', textAlign: 'center' }, align: "center", ref: "infocache", value: "" })
                    )
                ),
                _this.state.dappLocal.selectedQs.length == 0 ? '' : _react2.default.createElement(_EditScheduleTXModal2.default, { saveScheduleTX: _this.saveScheduleTX, cancelChangeScheduleTX: _this.cancelChangeScheduleTX,
                    Q: _this.state.dappLocal.selectedQs[0],
                    isEditScheduleModalOpen: _this.state.dappLocal.schedulerViewType == "Edit", gasPrice: _this.state.gasPrice })
            ) : _this.state.dappLocal.schedulerViewType == "New" ? _react2.default.createElement(_SchedulerJob2.default, { viewType: _this.state.dappLocal.schedulerViewType,
                goTo: _this.goTo }) : _react2.default.createElement(_SchedulerJob2.default, { goTo: _this.goTo, cleanEdit: _this.cleanEdit, viewType: _this.state.dappLocal.schedulerViewType, Q: _this.state.dappLocal.selectedQs.length == 0 ? null : _this.state.dappLocal.selectedQs[0] });
        };

        _this.store = _CastIronStore2.default;
        _this.state = {
            dappLocal: {
                recipient: '',
                schedulerViewType: "List", // Options are List, New, Edit
                selectedQs: [],
                filteredQs: [],
                filter: {},
                showSearch: false
            }

        };
        _this.wallet = _CastIronService2.default.wallet;
        return _this;
    }

    _createClass(SchedulerView, [{
        key: "cleanEdit",
        value: function cleanEdit() {
            _CastIronActions2.default.clearQueueSchedule();
            (0, _Utils.setDappLocalState)(this, { selectedQs: [] });
        }
    }]);

    return SchedulerView;
}(_reflux2.default.Component);

exports.default = SchedulerView;