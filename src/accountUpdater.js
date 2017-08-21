import SFTPClient from 'sftp-promises';
import R from 'ramda';


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
		return buffer.toString();
	}
}