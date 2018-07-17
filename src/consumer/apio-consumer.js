import HttpClient from '../http/client';
import JsonLDParser from '../parser/jsonldparser';
import {ConversionHandler, formConverter} from '../converters';

/**
 * Apio consumer
 */
export default class ApioConsumer {
	/**
	 * Creates a new ApioConsumer
	 * @param {object} authorizationHeaders
	 */
	constructor(authorizationHeaders) {
		this.client = new HttpClient();
		this.parser = new JsonLDParser();
		this.thingsCache = new Map();
		this.conversionHandler = new ConversionHandler();
		this.authorizationHeaders = authorizationHeaders;
	}

	/**
	 * Fetch a resource using its id.
	 * It also support specifying embedded fields as an array
	 * and included fields as an object.
	 * @param {string} id
	 * @param {Array<String>} embedded
	 * @param {object} fields
	 * @return {Thing}
	 */
	async fetchResource(id, embedded, fields) {
		const parameters = this.buildParameters(embedded, fields);

		const json = await this.client.get(
			id,
			this.authorizationHeaders,
			parameters
		);

		const {thing, embeddedThings} = this.parser.parseThing(json);

		this.updateCache(thing, embeddedThings);

		return this.conversionHandler.convert(thing);
	}

	/**
	 * Get the form associated to the operation
	 * @param {Operation} operation
	 * @return {Form}
	 */
	async getOperationForm(operation) {
		if (operation.expects == null) {
			throw new Error(
				`Operation ${operation.id} doesn't have a form associated`
			);
		}

		const json = await this.client.get(operation.expects);
		const {thing} = this.parser.parseThing(json);

		return formConverter(thing);
	}

	/**
	 * Execute the passed operation
	 * @param {Operation} operation
	 * @param {object} properties
	 * @param {boolean} includeFile
	 * @return {object}
	 */
	async performOperation(operation, properties, includeFile = false) {
		let body;

		if (properties != null) {
			body = includeFile
				? this.client.buildFormDataBody(properties)
				: this.client.buildJsonBody(properties);
		}

		return this.client.request(
			operation.method,
			operation.target,
			this.authorizationHeaders,
			body
		);
	}

	/**
	 * Add a converter for a type
	 * @param {string} type
	 * @param {function} converter
	 */
	addConverter(type, converter) {
		this.conversionHandler.addConverter(type, converter);
	}

	/**
	 * Update the local cache of things
	 * @param {Thing} thing
	 * @param {object} embeddedThings
	 */
	updateCache(thing, embeddedThings = {}) {
		this.thingsCache.set(thing.id, thing);

		for (const key of Object.keys(embeddedThings)) {
			this.thingsCache.set(key, embeddedThings[key]);
		}
	}

	/**
	 * Creates a valid parameters to be passed to the http client
	 * @param {Array<String>} embedded
	 * @param {object} fields
	 * @return {object}
	 */
	buildParameters(embedded, fields) {
		let parameters = {};
		if (embedded) {
			parameters.embedded = embedded.join(',');
		}

		if (fields) {
			parameters = Object.assign(parameters, this.parseFields(fields));
		}

		return parameters;
	}

	/**
	 * Transform the object to fit apio convention for fields parameter
	 * @param {object} fields
	 * @return {object}
	 */
	parseFields(fields) {
		let parsedFields = {};
		for (const key of Object.keys(fields)) {
			const value = Array.isArray(fields[key])
				? fields[key].join(',')
				: fields[key];

			parsedFields[`fields[${key}]`] = value;
		}

		return parsedFields;
	}
}
