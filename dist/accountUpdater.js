function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import SFTPClient from 'sftp-promises';
import R from 'ramda';

const parseDate = str => {
	const s = (l, r) => str.slice(l, r);
	return new Date(s(0, 4), s(4, 6), s(6, 8), s(8, 10), s(10, 12), s(12, 14));
};

const parsers = {
	FHDR: ([header, sequence, status, dateString]) => ({ sequence, status, dateString, date: parseDate(dateString) }),
	MHDR: ([header, sequence, accountId]) => ({ sequence, accountId }),
	TOKN: ([header, sequence, responseCode, token, expiration, recurring, reference]) => ({ sequence, responseCode, token, expiration, recurring, reference }),
	CARD: ([header, sequence, responseCode, cardNumber, expiration, reference]) => ({ sequence, responseCode, cardNumber, expiration, reference })
};

export default class AccountUpdaterClient {
	constructor({ username, password, accountId, apiAccesskey }) {
		this.IN = `/AUP-Cert/IN/${accountId}`;
		this.OUT = `/AUP-Cert/OUT/${accountId}`;
		this.MHDR = `MHDR,000001,${accountId},${apiAccesskey}`;

		this.client = new SFTPClient({ host: 'sftp.cardconex.com', username, password });
	}

	lsSubmissions() {
		var _this = this;

		return _asyncToGenerator(function* () {
			const { entries } = yield _this.client.ls(_this.IN);
			return R.map(R.prop('filename'), entries);
		})();
	}

	lsResponses() {
		var _this2 = this;

		return _asyncToGenerator(function* () {
			const { entries } = yield _this2.client.ls(_this2.OUT);
			return R.map(R.prop('filename'), entries);
		})();
	}

	submit(tokenArr) {
		var _this3 = this;

		return _asyncToGenerator(function* () {
			const path = `${_this3.IN}/${Date.now()}.csv`;
			const buffer = new Buffer([_this3.MHDR, ...tokenArr.map(function ({ token, reference }, i) {
				return `TOKN,${R.takeLast(6, `${1000002 + i}`)},${token},${reference}`;
			})].join('\n'));
			return yield _this3.client.putBuffer(buffer, path);
		})();
	}

	readResponse(filename) {
		var _this4 = this;

		return _asyncToGenerator(function* () {
			const buffer = yield _this4.client.getBuffer(`${_this4.OUT}/${filename}`);
			const string = buffer.toString();
			const arr = string.split('\n').filter(Boolean).map(function (e) {
				return e.split(',');
			});
			const pipe = function (type) {
				return R.pipe(R.filter(R.propEq(0, type)), R.map(parsers[type]))(arr);
			};
			console.log(string);
			return {
				fileHeader: R.head(pipe('FHDR')),
				merchantHeader: R.head(pipe('MHDR')),
				tokens: pipe('TOKN'),
				cards: pipe('CARD')
			};
		})();
	}
}