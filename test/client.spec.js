import HttpClient from '../src/http/client';

describe('Api client', () => {
	it('getQueryString should generate a correct query string when passing one parameter', () => {
		const client = new HttpClient();

		const queryString = client.getQueryString({key: 'value'});

		expect(queryString).toBe('?key=value');
	});
	it('getQueryString should generate a correct query string when passing several parameter', () => {
		const client = new HttpClient();

		const queryString = client.getQueryString({
			key1: 'value1',
			key2: 'value2'
		});

		expect(queryString).toBe('?key1=value1&key2=value2');
	});
});
