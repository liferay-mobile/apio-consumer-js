import HttpClient from '../../src/http/client';
import {Response} from 'cross-fetch';

export default class httpClientMock extends HttpClient {
	async doFetch(url, method, headers, body) {
		this.url = url;
		this.method = method;
		this.body = body;
		this.headers = headers;

		return new Response('{}');
	}
}
