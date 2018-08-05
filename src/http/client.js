import fetch from 'cross-fetch';
import FormData from 'form-data';

/**
 * HttpClient
 * @review
 */
export default class HttpClient {
	/**
	 * Perform a GET http request
	 * @param {String} url
	 * @param {object} headers
	 * @param {object} parameters
	 * @return {object}
	 * @review
	 */
	async get(url, headers, parameters) {
		if (parameters) {
			url += this.getQueryString(parameters);
		}

		const response = await this.doFetch(url, 'GET', headers);

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
	 * Perform an http request using the given method
	 * @param {String} method
	 * @param {String} url
	 * @param {object} headers
	 * @param {object} body
	 * @return {object}
	 * @review
	 */
	async request(method, url, headers = {}, body) {
		if (typeof body === 'string') {
			headers['Content-type'] = 'application/json';
		}

		const response = await this.doFetch(url, method, headers, body);

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
	 * Perform the http request
	 * @param {string} url
	 * @param {string} method
	 * @param {object} headers
	 * @param {object} body
	 * @return {Response}
	 * @review
	 */
	doFetch(url, method, headers, body) {
		return fetch(url, {
			method,
			headers,
			body,
		});
	}

	/**
	 * Get the query string from a object
	 * @param {object} parameters
	 * @return {String}
	 * @review
	 */
	getQueryString(parameters) {
		const queries = Object.keys(parameters).map(
			key => `${key}=${parameters[key]}`
		);

		return `?${queries.join('&')}`;
	}

	/**
	 * Build a json body with the object provided
	 * @param {object} object
	 * @return {object}
	 * @review
	 */
	buildJsonBody(object) {
		return JSON.stringify(object);
	}

	/**
	 * Buid a form data body with the object provided
	 * @param {object} object
	 * @return {object}
	 * @review
	 */
	buildFormDataBody(object) {
		return Object.keys(object).reduce((formData, key) => {
			formData.append(key, object[key]);
			return formData;
		}, new FormData());
	}
}
