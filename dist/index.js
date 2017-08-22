var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import post from './post.js';
import PropTypes from 'prop-types';
import AccountUpdaterClient from './accountUpdater.js';

export default class PayConex {
	constructor({ accountId, apiAccesskey, sftpUsername: username, sftpPassword: password }) {
		const api = post({ accountId, apiAccesskey });
		this.qsapi = api('qsapi');
		this.tsapi = api('tsapi');
		this.rsapi = api('rsapi');
		this.accountUpdaterClient = new AccountUpdaterClient({ username, password, accountId, apiAccesskey });
	}
	store(cardDetails) {
		return this.qsapi(_extends({ tenderType: 'CARD', transactionType: 'STORE' }, cardDetails));
	}

	sale(saleDetails) {
		return this.qsapi(_extends({ tenderType: 'CARD', transactionType: 'SALE' }, saleDetails));
	}

	reissue(saleDetails) {
		return this.qsapi(_extends({ tenderType: 'CARD', transactionType: 'SALE', reissue: 1 }, saleDetails));
	}

	status({ transactionId }) {
		PropTypes.checkPropTypes({ transactionId: PropTypes.string.isRequired }, arguments[0], 'prop', 'PayConex.status', () => new Error().stack);
		return this.tsapi({ action: 'GET_TRANSACTION_STATUS', transactionId });
	}

	batch({ startDate, endDate } = {}) {
		return this.rsapi({ startDate, endDate, status: 'APPROVED', batchDetail: 1 });
	}

	listAUSubmissions() {
		var _this = this;

		return _asyncToGenerator(function* () {
			return yield _this.accountUpdaterClient.lsSubmissions();
		})();
	}

	listAUResponses() {
		var _this2 = this;

		return _asyncToGenerator(function* () {
			return yield _this2.accountUpdaterClient.lsResponses();
		})();
	}

	readAUResponse(filename) {
		var _this3 = this;

		return _asyncToGenerator(function* () {
			return yield _this3.accountUpdaterClient.readResponse(filename);
		})();
	}

	submitTokensForUpdate(tokenArr) {
		var _this4 = this;

		return _asyncToGenerator(function* () {
			return yield _this4.accountUpdaterClient.submit(tokenArr);
		})();
	}
}