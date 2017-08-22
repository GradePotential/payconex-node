'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _sftpPromises = require('sftp-promises');

var _sftpPromises2 = _interopRequireDefault(_sftpPromises);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parseDate = function parseDate(str) {
	var s = function s(l, r) {
		return str.slice(l, r);
	};
	return new Date(s(0, 4), s(4, 6), s(6, 8), s(8, 10), s(10, 12), s(12, 14));
};

var parsers = {
	FHDR: function FHDR(_ref) {
		var _ref2 = _slicedToArray(_ref, 4),
		    header = _ref2[0],
		    sequence = _ref2[1],
		    status = _ref2[2],
		    dateString = _ref2[3];

		return { sequence: sequence, status: status, dateString: dateString, date: parseDate(dateString) };
	},
	MHDR: function MHDR(_ref3) {
		var _ref4 = _slicedToArray(_ref3, 3),
		    header = _ref4[0],
		    sequence = _ref4[1],
		    accountId = _ref4[2];

		return { sequence: sequence, accountId: accountId };
	},
	TOKN: function TOKN(_ref5) {
		var _ref6 = _slicedToArray(_ref5, 7),
		    header = _ref6[0],
		    sequence = _ref6[1],
		    responseCode = _ref6[2],
		    token = _ref6[3],
		    expiration = _ref6[4],
		    recurring = _ref6[5],
		    reference = _ref6[6];

		return { sequence: sequence, responseCode: responseCode, token: token, expiration: expiration, recurring: recurring, reference: reference };
	},
	CARD: function CARD(_ref7) {
		var _ref8 = _slicedToArray(_ref7, 6),
		    header = _ref8[0],
		    sequence = _ref8[1],
		    responseCode = _ref8[2],
		    cardNumber = _ref8[3],
		    expiration = _ref8[4],
		    reference = _ref8[5];

		return { sequence: sequence, responseCode: responseCode, cardNumber: cardNumber, expiration: expiration, reference: reference };
	}
};

var AccountUpdaterClient = function () {
	function AccountUpdaterClient(_ref9) {
		var username = _ref9.username,
		    password = _ref9.password,
		    accountId = _ref9.accountId,
		    apiAccesskey = _ref9.apiAccesskey;

		_classCallCheck(this, AccountUpdaterClient);

		this.IN = '/AUP-Cert/IN/' + accountId;
		this.OUT = '/AUP-Cert/OUT/' + accountId;
		this.MHDR = 'MHDR,000001,' + accountId + ',' + apiAccesskey;

		this.client = new _sftpPromises2.default({ host: 'sftp.cardconex.com', username: username, password: password });
	}

	_createClass(AccountUpdaterClient, [{
		key: 'lsSubmissions',
		value: function () {
			var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
				var _ref11, entries;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.next = 2;
								return this.client.ls(this.IN);

							case 2:
								_ref11 = _context.sent;
								entries = _ref11.entries;
								return _context.abrupt('return', _ramda2.default.map(_ramda2.default.prop('filename'), entries));

							case 5:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, this);
			}));

			function lsSubmissions() {
				return _ref10.apply(this, arguments);
			}

			return lsSubmissions;
		}()
	}, {
		key: 'lsResponses',
		value: function () {
			var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
				var _ref13, entries;

				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.next = 2;
								return this.client.ls(this.OUT);

							case 2:
								_ref13 = _context2.sent;
								entries = _ref13.entries;
								return _context2.abrupt('return', _ramda2.default.map(_ramda2.default.prop('filename'), entries));

							case 5:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function lsResponses() {
				return _ref12.apply(this, arguments);
			}

			return lsResponses;
		}()
	}, {
		key: 'submit',
		value: function () {
			var _ref14 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(tokenArr) {
				var path, buffer;
				return regeneratorRuntime.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								path = this.IN + '/' + Date.now() + '.csv';
								buffer = new Buffer([this.MHDR].concat(_toConsumableArray(tokenArr.map(function (_ref15, i) {
									var token = _ref15.token,
									    reference = _ref15.reference;
									return 'TOKN,' + _ramda2.default.takeLast(6, '' + (1000002 + i)) + ',' + token + ',' + reference;
								}))).join('\n'));
								_context3.next = 4;
								return this.client.putBuffer(buffer, path);

							case 4:
								return _context3.abrupt('return', _context3.sent);

							case 5:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, this);
			}));

			function submit(_x) {
				return _ref14.apply(this, arguments);
			}

			return submit;
		}()
	}, {
		key: 'readResponse',
		value: function () {
			var _ref16 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(filename) {
				var buffer, string, arr, pipe;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return this.client.getBuffer(this.OUT + '/' + filename);

							case 2:
								buffer = _context4.sent;
								string = buffer.toString();
								arr = string.split('\n').filter(Boolean).map(function (e) {
									return e.split(',');
								});

								pipe = function pipe(type) {
									return _ramda2.default.pipe(_ramda2.default.filter(_ramda2.default.propEq(0, type)), _ramda2.default.map(parsers[type]))(arr);
								};

								console.log(string);
								return _context4.abrupt('return', {
									fileHeader: _ramda2.default.head(pipe('FHDR')),
									merchantHeader: _ramda2.default.head(pipe('MHDR')),
									tokens: pipe('TOKN'),
									cards: pipe('CARD')
								});

							case 8:
							case 'end':
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function readResponse(_x2) {
				return _ref16.apply(this, arguments);
			}

			return readResponse;
		}()
	}]);

	return AccountUpdaterClient;
}();

exports.default = AccountUpdaterClient;