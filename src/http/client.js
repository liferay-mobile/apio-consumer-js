import fetch from 'cross-fetch';

/**
 * HttpClient
 */
export default class HttpClient {
	/**
	 * Perform a GET http request
	 * @param {String} url
	 * @param {Object} headers
	 * @param {Object} parameters
	 * @return {Object}
	 */
	async get(url, headers, parameters) {
		if (parameters) {
			url += this.getQueryString(parameters);
		}

		const response = await fetch(url, {
			headers: headers,
		});

		if (response.ok) {
			return response.json();
		} else {
			const body = await response.text();
			const error = new Error(`Error calling ${url}`);
			error.data = body;
			throw error;
		}
	}

	/**
	 * Get the query string from a object
	 * @param {Object} parameters
	 * @return {String}
	 */
	getQueryString(parameters) {
		const queries = Object.keys(parameters).map(
			key => `${key}=${parameters[key]}`
		);

		return `?${queries.join('&')}`;
	}
}
