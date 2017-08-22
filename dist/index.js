'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _post = require('./post.js');

var _post2 = _interopRequireDefault(_post);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _accountUpdater = require('./accountUpdater.js');

var _accountUpdater2 = _interopRequireDefault(_accountUpdater);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PayConex = function () {
	function PayConex(_ref) {
		var accountId = _ref.accountId,
		    apiAccesskey = _ref.apiAccesskey,
		    username = _ref.sftpUsername,
		    password = _ref.sftpPassword;

		_classCallCheck(this, PayConex);

		var api = (0, _post2.default)({ accountId: accountId, apiAccesskey: apiAccesskey });
		this.qsapi = api('qsapi');
		this.tsapi = api('tsapi');
		this.rsapi = api('rsapi');
		this.accountUpdaterClient = new _accountUpdater2.default({ username: username, password: password, accountId: accountId, apiAccesskey: apiAccesskey });
	}

	_createClass(PayConex, [{
		key: 'store',
		value: function store(cardDetails) {
			return this.qsapi(_extends({ tenderType: 'CARD', transactionType: 'STORE' }, cardDetails));
		}
	}, {
		key: 'sale',
		value: function sale(saleDetails) {
			return this.qsapi(_extends({ tenderType: 'CARD', transactionType: 'SALE' }, saleDetails));
		}
	}, {
		key: 'reissue',
		value: function reissue(saleDetails) {
			return this.qsapi(_extends({ tenderType: 'CARD', transactionType: 'SALE', reissue: 1 }, saleDetails));
		}
	}, {
		key: 'status',
		value: function status(_ref2) {
			var transactionId = _ref2.transactionId;

			_propTypes2.default.checkPropTypes({ transactionId: _propTypes2.default.string.isRequired }, arguments[0], 'prop', 'PayConex.status', function () {
				return new Error().stack;
			});
			return this.tsapi({ action: 'GET_TRANSACTION_STATUS', transactionId: transactionId });
		}
	}, {
		key: 'batch',
		value: function batch() {
			var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
			    startDate = _ref3.startDate,
			    endDate = _ref3.endDate;

			return this.rsapi({ startDate: startDate, endDate: endDate, status: 'APPROVED', batchDetail: 1 });
		}
	}, {
		key: 'listAUSubmissions',
		value: function () {
			var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this.accountUpdaterClient.lsSubmissions();

							case 2:
								return _context.abrupt('return', _context.sent);

							case 3:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function listAUSubmissions() {
				return _ref4.apply(this, arguments);
			}

			return listAUSubmissions;
		}()
	}, {
		key: 'listAUResponses',
		value: function () {
			var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.accountUpdaterClient.lsResponses();

							case 2:
								return _context2.abrupt('return', _context2.sent);

							case 3:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function listAUResponses() {
				return _ref5.apply(this, arguments);
			}

			return listAUResponses;
		}()
	}, {
		key: 'readAUResponse',
		value: function () {
			var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(filename) {
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.next = 2;
								return this.accountUpdaterClient.readResponse(filename);

							case 2:
								return _context3.abrupt('return', _context3.sent);

							case 3:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function readAUResponse(_x2) {
				return _ref6.apply(this, arguments);
			}

			return readAUResponse;
		}()
	}, {
		key: 'submitTokensForUpdate',
		value: function () {
			var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(tokenArr) {
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return this.accountUpdaterClient.submit(tokenArr);

							case 2:
								return _context4.abrupt('return', _context4.sent);

							case 3:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function submitTokensForUpdate(_x3) {
				return _ref7.apply(this, arguments);
			}

			return submitTokensForUpdate;
		}()
	}]);

	return PayConex;
}();

exports.default = PayConex;