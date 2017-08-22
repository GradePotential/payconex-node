'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _toSnakeCase = require('to-snake-case');

var _toSnakeCase2 = _interopRequireDefault(_toSnakeCase);

var _camelcaseKeys = require('camelcase-keys');

var _camelcaseKeys2 = _interopRequireDefault(_camelcaseKeys);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var snakeKeys = _ramda2.default.pipe(_ramda2.default.invertObj, _ramda2.default.map(_toSnakeCase2.default), _ramda2.default.invertObj);

var getHash = function getHash(_ref) {
	var accountId = _ref.accountId,
	    apiAccesskey = _ref.apiAccesskey;

	var timestamp = Math.floor(new Date() / 1000);
	var hash = _crypto2.default.createHash('sha256').update(accountId + ',' + apiAccesskey + ',' + timestamp).digest('hex');
	return { timestamp: timestamp, hash: hash };
};

exports.default = function (_ref2) {
	var accountId = _ref2.accountId,
	    apiAccesskey = _ref2.apiAccesskey;
	return function (api) {
		return function () {
			var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var _getHash = getHash({ accountId: accountId, apiAccesskey: apiAccesskey }),
			    timestamp = _getHash.timestamp,
			    hash = _getHash.hash;

			var defaults = _ramda2.default.merge({
				accountId: accountId,
				responseFormat: 'JSON'
			}, api == 'qsapi' ? { timestamp: timestamp, hash: hash } : { apiAccesskey: apiAccesskey });
			var body = _querystring2.default.stringify(snakeKeys(_extends({}, defaults, data)));

			var headers = {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(body)
			};

			var url = 'https://cert-tls12.payconex.net/api/' + api + '/3.8';
			return (0, _nodeFetch2.default)(url, { method: 'POST', body: body, headers: headers }).then(function (r) {
				return r.json();
			}).then(function (obj) {
				return (0, _camelcaseKeys2.default)(obj, { deep: true });
			});
		};
	};
};