import HttpClient from '../../src/http/client';
import {Response} from 'cross-fetch';

export default class httpClientSpy extends HttpClient {
	async get(url, headers, parameters) {
		this.url = url;
		this.headers = headers;
		this.parameters = parameters;

		return new Response('{}');
	}

	async doFetch(url, method, headers, body) {
		this.url = url;
		this.method = method;
		this.body = body;
		this.headers = headers;

		return new Response('{}');
	}
}
