var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import snake from 'to-snake-case';
import camelcaseKeys from 'camelcase-keys';
import fetch from 'node-fetch';
import qs from 'querystring';
import R from 'ramda';
import crypto from 'crypto';

const snakeKeys = R.pipe(R.invertObj, R.map(snake), R.invertObj);

const getHash = ({ accountId, apiAccesskey }) => {
	const timestamp = Math.floor(new Date() / 1000);
	const hash = crypto.createHash('sha256').update(`${accountId},${apiAccesskey},${timestamp}`).digest('hex');
	return { timestamp, hash };
};

export default (({ accountId, apiAccesskey }) => api => (data = {}) => {
	const { timestamp, hash } = getHash({ accountId, apiAccesskey });
	const defaults = R.merge({
		accountId,
		responseFormat: 'JSON'
	}, api == 'qsapi' ? { timestamp, hash } : { apiAccesskey });
	const body = qs.stringify(snakeKeys(_extends({}, defaults, data)));

	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': Buffer.byteLength(body)
	};

	const url = `https://cert-tls12.payconex.net/api/${api}/3.8`;
	return fetch(url, { method: 'POST', body, headers }).then(r => r.json()).then(obj => camelcaseKeys(obj, { deep: true }));
});