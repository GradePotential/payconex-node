import SFTPClient from 'sftp-promises';
import R from 'ramda';

const parseDate = str => {
	const s = (l,r) => str.slice(l,r);
	return new Date(s(0,4), s(4,6), s(6,8), s(8,10), s(10,12), s(12,14));
};

const parsers = {
	FHDR: ([header, sequence, status, dateString]) => ({sequence, status, dateString, date: parseDate(dateString)}),
	MHDR: ([header, sequence, accountId]) => ({sequence, accountId}),
	TOKN: ([header, sequence, responseCode, token, expiration, recurring, reference]) => ({sequence, responseCode, token, expiration, recurring, reference}),
	CARD: ([header, sequence, responseCode, cardNumber, expiration, reference]) => ({sequence, responseCode, cardNumber, expiration, reference})
};


export default class AccountUpdaterClient {
	constructor({username, password, accountId, apiAccesskey}){
		this.IN = `/AUP-Cert/IN/${accountId}`;
		this.OUT = `/AUP-Cert/OUT/${accountId}`;
		this.MHDR = `MHDR,000001,${accountId},${apiAccesskey}`;

		this.client = new SFTPClient({host: 'sftp.cardconex.com', username, password});
	}

	async lsSubmissions(){
		const {entries} = await this.client.ls(this.IN);
		return R.map(R.prop('filename'), entries);
	}

	async lsResponses(){
		const {entries} = await this.client.ls(this.OUT);
		return R.map(R.prop('filename'), entries);
	}

	async submit(tokenArr){
		const path = `${this.IN}/${Date.now()}.csv`;
		const buffer = new Buffer([
			this.MHDR,
			...tokenArr.map(({token, reference}, i) => `TOKN,${R.takeLast(6, `${1000002 + i}`)},${token},${reference}`)
		].join('\n'));
		return await this.client.putBuffer(buffer, path);
	}

	async readResponse(filename){
		const buffer = await this.client.getBuffer(`${this.OUT}/${filename}`);
		const string = buffer.toString();
		const arr = string.split('\n').filter(Boolean).map(e => e.split(','));
		const pipe = type => R.pipe(
				R.filter(R.propEq(0, type)),
				R.map(parsers[type])
			)(arr);
		console.log(string);
		return {
			fileHeader: R.head(pipe('FHDR')),
			merchantHeader: R.head(pipe('MHDR')),
			tokens: pipe('TOKN'),
			cards: pipe('CARD')
		};
	}
}