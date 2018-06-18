import fetch from 'cross-fetch';
import FormData from 'form-data';

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
			headers,
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
	 * Perform an http request using the given method
	 * @param {String} method
	 * @param {String} url
	 * @param {Object} headers
	 * @param {Object} body
	 * @return {Object}
	 */
	async request(method, url, headers = {}, body) {
		const contentType =
			body instanceof FormData
				? 'multipart/form-data'
				: 'application/json';
		const response = await fetch(url, {
			method,
			headers: Object.assign(headers, {'Content-Type': contentType}),
			body,
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

	/**
	 * Build a json body with the object provided
	 * @param {object} object
	 * @return {object}
	 */
	buildJsonBody(object) {
		return JSON.stringify(object);
	}

	/**
	 * Buid a form data body with the object provided
	 * @param {object} object
	 * @return {object}
	 */
	buildFormDataBody(object) {
		return Object.keys(object).reduce((formData, key) => {
			formData.append(key, object[key]);
			return formData;
		}, new FormData());
	}
}
