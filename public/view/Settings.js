'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reflux = require('reflux');

var _reflux2 = _interopRequireDefault(_reflux);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _AlertModal = require('../components/AlertModal');

var _AlertModal2 = _interopRequireDefault(_AlertModal);

var _AlertModalUser2 = require('../common/AlertModalUser');

var _AlertModalUser3 = _interopRequireDefault(_AlertModalUser2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _CastIronService = require('../service/CastIronService');

var _CastIronService2 = _interopRequireDefault(_CastIronService);

var _CastIronActions = require('../action/CastIronActions');

var _CastIronActions2 = _interopRequireDefault(_CastIronActions);

var _AcctMgrService = require('../service/AcctMgrService');

var _AcctMgrService2 = _interopRequireDefault(_AcctMgrService);

var _CastIronStore = require('../store/CastIronStore');

var _CastIronStore2 = _interopRequireDefault(_CastIronStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Settings = function (_AlertModalUser) {
	_inherits(Settings, _AlertModalUser);

	function Settings(props) {
		_classCallCheck(this, Settings);

		var _this = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this, props));

		_this.handleCustomGasPriceUpdate = function (event) {
			var value = event.target.value;
			if (isNaN(value)) {
				_this.openModal("Please enter a number!");
				event.target.value = value.slice(0, -1);
			} else {
				_this.props.handleCustomGasPriceUpdate(parseInt(event.target.value));
			}
		};

		_this.handleClickBack = function () {
			if (!_this.props.isCustomGasPriceValid()) {
				_this.openModal("Please enter custom gas price!");
			} else {
				_this.props.handleClickBack();
				_CastIronActions2.default.infoUpdate();
			}
		};

		_this.handleNewArch = function (event) {
			_this.accMgr.newArchive(_this.variable).then(function () {
				_this.variable = undefined;
				_this.openModal("New Archive created. You still needs to be unlocked to use it.");
			});
			// Should we update config.json with actual archive path, instead of pre-defined? 
			// Should we *also* update config.json to store custom gas price, if set?
		};

		_this.handleNewAcct = function (event) {
			var stage = Promise.resolve();
			stage.then(function () {
				_this.refs.fi.disabled = true;
				_this.refs.fa.disabled = true;
				return _this.setState({ waiting: true });
			}).then(function () {
				_this.updateNew();
			});
		};

		_this.dappTable = function () {
			//react understand array
			return _this.state.dappList.map(function (appName) {
				return _react2.default.createElement(
					'tr',
					{ className: 'balance-sheet' },
					_react2.default.createElement(
						'td',
						{ className: 'balance-sheet', style: { width: "1000px" } },
						appName
					),
					_react2.default.createElement(
						'td',
						{ className: 'balance-sheet', style: { width: "10%" } },
						'y'
					),
					_react2.default.createElement(
						'td',
						{ className: 'balance-sheet', style: { width: "10%" } },
						'y'
					),
					_react2.default.createElement(
						'td',
						{ className: 'balance-sheet', style: { width: "10%" } },
						'n'
					)
				);
			});
		};

		_this.updateNew = function () {
			console.log("calling update now");
			return _this.accMgr.newAccount(_this.variable).then(function (address) {
				_this.variable = undefined;
				_this.refs.vip.value = '';
				_this.setState({ waiting: false });
				_this.openModal("New Address: " + address);
				_this.refs.fi.disabled = false;
				_this.refs.fa.disabled = false;
			}).catch(function (err) {
				_this.variable = undefined;
				_this.refs.vip.value = '';
				_this.setState({ waiting: false });
				_this.openModal("Creation Failed");
				_this.refs.fi.disabled = false;
				_this.refs.fa.disabled = false;
			});
		};

		_this.handleReveal = function (event) {
			_this.setState({ reveal: !_this.state.reveal });
		};

		_this.handleReveal2 = function (event) {
			_this.setState({ reveal2: !_this.state.reveal2 });
		};

		_this.handleImport = function (event) {
			console.log("Importing " + _this.keypath);
			_this.setState({ waiting: true });
			_this.refs.fi.disabled = true;
			_this.refs.fa.disabled = true;
			_this.accMgr.importFromJSON(_this.keypath, _this.variable).then(function (r) {
				_this.accMgr.update(r.keyObj, r.password).then(function (address) {
					r = {};
					_this.refs.vif.value = '';
					_this.keypath = undefined;
					_this.refs.vop.value = '';
					_this.variable = undefined;
					_this.setState({ waiting: false });
					_this.openModal("Imported Address: " + address);
					_this.refs.fi.disabled = false;
					_this.refs.fa.disabled = false;
				});
			}).catch(function (err) {
				_this.refs.vif.value = '';
				_this.keypath = undefined;
				_this.refs.vop.value = '';
				_this.variable = undefined;
				_this.setState({ waiting: false });
				_this.openModal("Import Failed!");
				_this.refs.fi.disabled = false;
				_this.refs.fa.disabled = false;
			});
		};

		_this.updateVar = function (event) {
			_this.variable = event.target.value;
		};

		_this.updatePath = function (event) {
			console.log(_this.refs.vif.files[0].path);
			_this.keypath = _this.refs.vif.files[0].path;
		};

		_this.handleHover = function (enter) {
			if (enter === 'fa') {
				_this.refs.fa.disabled = false;
				_this.refs.fi.disabled = true;
			} else if (enter === 'fi') {
				_this.refs.fi.disabled = false;
				_this.refs.fa.disabled = true;
			}
		};

		_this.accountMgr = function () {
			if (_fs2.default.existsSync(_this.wallet.archfile) === false) {
				// create new buttercup archive using one time password input
				return _react2.default.createElement(
					'div',
					{ style: { align: 'center' } },
					_react2.default.createElement(
						'fieldset',
						{ style: { display: 'inline-block', marginLeft: '32%', padding: '20px' } },
						_react2.default.createElement(
							'legend',
							{ style: { fontWeight: 'bold', marginBottom: '3px' } },
							'Please Enter New Master Password:'
						),
						_react2.default.createElement('input', { type: _this.state.reveal ? "text" : "password", onChange: _this.updateVar }),
						_react2.default.createElement('input', { type: 'button', value: _this.state.reveal ? "Hide" : "Reveal", onClick: _this.handleReveal }),
						_react2.default.createElement('input', { type: 'button', value: 'Set Master Password', onClick: _this.handleNewArch })
					)
				);
			}

			if (_this.state.unlocked === false) {
				return _react2.default.createElement(
					'p',
					{ style: { fontSize: '1.5em', height: '102px', textAlign: 'center' } },
					' Please Unlock Your Master Password First! '
				);
			} else {
				return _react2.default.createElement(
					'div',
					{ style: { align: 'center' } },
					_react2.default.createElement(
						'fieldset',
						{ ref: 'fa', id: 'fa', onMouseEnter: _this.handleHover.bind(_this, 'fa'), onMouseLeave: _this.handleNoHover.bind(_this, 'fa'),
							style: { display: 'inline-block', marginLeft: '130px', padding: '20px' } },
						_react2.default.createElement(
							'legend',
							{ style: { fontWeight: 'bold', marginBottom: '3px' } },
							'Create New Account:'
						),
						'Please Enter Password For New Account:',
						_react2.default.createElement('br', null),
						_react2.default.createElement('input', { ref: 'vip', style: { marginLeft: '6px' }, type: _this.state.reveal ? "text" : "password", onChange: _this.updateVar }),
						_react2.default.createElement('input', { type: 'button', style: { marginRight: '6px' }, value: _this.state.reveal ? "Hide" : "Reveal", onClick: _this.handleReveal }),
						_this.state.waiting ? _react2.default.createElement('div', { className: 'loader', style: { height: '13px', width: '13px', display: "inline-block" } }) : _react2.default.createElement('input', { type: 'button', value: 'Create', onClick: _this.handleNewAcct })
					),
					_react2.default.createElement(
						'fieldset',
						{ ref: 'fi', id: 'fi', onMouseEnter: _this.handleHover.bind(_this, 'fi'), onMouseLeave: _this.handleNoHover.bind(_this, 'fi'),
							style: { display: 'inline-block', padding: '20px' } },
						_react2.default.createElement(
							'legend',
							{ style: { fontWeight: 'bold' } },
							'Import Account:'
						),
						'Please Select File:',
						_react2.default.createElement('input', { ref: 'vif', style: { marginLeft: '6px' }, type: 'file', onChange: _this.updatePath }),
						_react2.default.createElement('br', null),
						'Please Enter Password Of The Account:',
						_react2.default.createElement('input', { ref: 'vop', style: { marginLeft: '6px' }, type: _this.state.reveal2 ? "text" : "password", onChange: _this.updateVar }),
						_react2.default.createElement('input', { type: 'button', style: { marginRight: '6px' }, value: _this.state.reveal2 ? "Hide" : "Reveal", onClick: _this.handleReveal2 }),
						_this.state.waiting ? _react2.default.createElement('div', { className: 'loader', style: { height: '13px', width: '13px', display: "inline-block" } }) : _react2.default.createElement('input', { type: 'button', value: 'Create', onClick: _this.handleImport })
					)
				);
			}
		};

		_this.render = function () {
			var visibility = 'hide';
			if (_this.props.visibility) visibility = 'show';

			return _react2.default.createElement(
				'div',
				{ id: 'settings',
					className: visibility },
				_react2.default.createElement(
					'h2',
					null,
					_react2.default.createElement(
						'a',
						{ style: { display: 'inline' }, href: '#' },
						'General'
					),
					_react2.default.createElement(
						'p',
						{ style: { display: 'inline', margin: "0 0 0 71%" } },
						"Network ID: " + _this.wallet.networkID
					)
				),
				_react2.default.createElement('hr', { color: '#333', width: '90%' }),
				_react2.default.createElement(
					'div',
					{ style: { display: 'block', marginLeft: "7%", marginRight: "10%", marginTop: '40px', marginBottom: '40px', textAlign: "center" } },
					_react2.default.createElement(
						'table',
						{ className: 'settings-sheet', border: '0' },
						_react2.default.createElement(
							'tbody',
							null,
							_react2.default.createElement(
								'form',
								{ style: { textAlign: 'center' }, onSubmit: function onSubmit(e) {
										e.preventDefault();
									} },
								_react2.default.createElement(
									'fieldset',
									{ style: { marginLeft: "7.5%", padding: "5px 25px 5px 25px", width: "83%", textAlign: "center" } },
									_react2.default.createElement(
										'legend',
										{ style: { textAlign: 'left', fontWeight: "bold" } },
										'Gas Price: '
									),
									_react2.default.createElement(
										'tr',
										{ className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
										_react2.default.createElement(
											'td',
											{ className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)", marginLeft: "30px" } },
											_react2.default.createElement(
												'label',
												{ style: { fontSize: '1.05em', fontWeight: "bold" } },
												_react2.default.createElement('input', { type: 'radio',
													onClick: _this.props.handleGasPriceSelect, name: 'gasprice', value: 'low' }),
												'Slow'
											),
											_react2.default.createElement('br', null)
										),
										_react2.default.createElement(
											'td',
											{ className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
											_react2.default.createElement(
												'label',
												{ style: { fontSize: '1.05em', fontWeight: "bold" } },
												_react2.default.createElement('input', { type: 'radio',
													onClick: _this.props.handleGasPriceSelect, name: 'gasprice', value: 'mid' }),
												'Mid'
											),
											_react2.default.createElement('br', null)
										),
										_react2.default.createElement(
											'td',
											{ className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
											_react2.default.createElement(
												'label',
												{ style: { fontSize: '1.05em', fontWeight: "bold" } },
												_react2.default.createElement('input', { type: 'radio',
													onClick: _this.props.handleGasPriceSelect, name: 'gasprice', value: 'high', defaultChecked: true }),
												'Normal'
											),
											_react2.default.createElement('br', null)
										),
										_react2.default.createElement(
											'td',
											{ className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
											_react2.default.createElement(
												'label',
												{ style: { fontSize: '1.05em', fontWeight: "bold" } },
												_react2.default.createElement('input', { type: 'radio',
													onClick: _this.props.handleGasPriceSelect, name: 'gasprice', value: 'fast' }),
												'Fast'
											),
											_react2.default.createElement('br', null)
										),
										_react2.default.createElement(
											'td',
											{ className: 'settings-sheet', style: { backgroundColor: "rgba(0,0,0,0)" } },
											_react2.default.createElement(
												'label',
												{ style: { fontSize: '1.05em', fontWeight: "bold" } },
												_react2.default.createElement('input', { type: 'radio',
													onClick: _this.props.handleGasPriceSelect, name: 'gasprice', value: 'custom' }),
												'Custom',
												_react2.default.createElement('input', { type: 'text', style: { marginLeft: '10px' }, name: 'custom_gasprice',
													disabled: _this.props.isCustomGasPrice, onChange: _this.handleCustomGasPriceUpdate, placeholder: 'custom (in gwei)...' })
											)
										)
									)
								)
							)
						)
					)
				),
				_react2.default.createElement(
					'h2',
					null,
					_react2.default.createElement(
						'a',
						{ href: '#' },
						'Accounts'
					)
				),
				_react2.default.createElement('hr', { color: '#333', width: '90%' }),
				_react2.default.createElement(
					'div',
					{ style: { display: 'block', margin: '40px' } },
					_this.accountMgr()
				),
				_react2.default.createElement(
					'div',
					{ style: { margin: '150px', textAlign: "center" } },
					_react2.default.createElement('input', { type: 'button', className: 'button', onClick: _this.handleClickBack, value: 'Back' })
				),
				_react2.default.createElement(_AlertModal2.default, { content: _this.state.alertContent, isAlertModalOpen: _this.state.isAlertModalOpen, close: _this.closeModal })
			);
		};

		_this.store = _CastIronStore2.default;

		_this.state = {
			reveal: false,
			reveal2: false,
			waiting: false,
			dappList: ['Scheduler', 'Eleven Peers', 'Mesh Eleven', 'My Profolios', 'Blood Line Registry', 'ENS bidding app', 'Club Badge', '11BE Blog', 'Zombie Battles', 'Crypto Fighters']
		};

		_this.wallet = _CastIronService2.default.wallet;
		_this.accMgr = _AcctMgrService2.default.accMgr;
		_this.variable = undefined;
		_this.keypath = undefined;
		return _this;
	}

	_createClass(Settings, [{
		key: 'handleNoHover',
		value: function handleNoHover(left) {
			if (left === 'fa' && this.refs.fi.disabled) {
				this.refs.fi.disabled = false;
			} else if (left === 'fi' && this.refs.fa.disabled) {
				this.refs.fa.disabled = false;
			}
		}
	}]);

	return Settings;
}(_AlertModalUser3.default);

exports.default = Settings;