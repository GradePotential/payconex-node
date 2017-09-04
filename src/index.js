import 'babel-polyfill';
import post from './post.js';
import PropTypes from 'prop-types';
import AccountUpdaterClient from './accountUpdater.js';


export default class PayConex {
	constructor({accountId, apiAccesskey, sftpUsername: username, sftpPassword: password}){
		const api = post({accountId, apiAccesskey});
		this.qsapi = api('qsapi');
		this.tsapi = api('tsapi');
		this.rsapi = api('rsapi');
		this.accountUpdaterClient = new AccountUpdaterClient({username, password, accountId, apiAccesskey});
	}
	store(cardDetails){
		return this.qsapi({tenderType: 'CARD', transactionType: 'STORE', ...cardDetails});
	}

	sale(saleDetails){
		return this.qsapi({tenderType: 'CARD', transactionType: 'SALE', ...saleDetails});
	}

	reissue(saleDetails){
		return this.qsapi({tenderType: 'CARD', transactionType: 'SALE', reissue: 1, ...saleDetails});
	}

	status({transactionId}){
		PropTypes.checkPropTypes({transactionId: PropTypes.string.isRequired}, arguments[0], 'prop', 'PayConex.status', () => new Error().stack);
		return this.tsapi({action: 'GET_TRANSACTION_STATUS', transactionId});
	}

	batch({startDate, endDate} = {}){
		return this.rsapi({startDate, endDate, status: 'APPROVED', batchDetail: 1});
	}

	async listAUSubmissions(){
		return await this.accountUpdaterClient.lsSubmissions();
	}

	async listAUResponses(){
		return await this.accountUpdaterClient.lsResponses();
	}

	async readAUResponse(filename){
		return await this.accountUpdaterClient.readResponse(filename);
	}

	async submitTokensForUpdate(tokenArr){
		return await this.accountUpdaterClient.submit(tokenArr);
	}
}