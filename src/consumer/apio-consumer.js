import HttpClient from '../http/client';
import JsonLDParser from '../parser/jsonldparser';
import {formConverter} from '../converters';

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
		this.authorizationHeaders = authorizationHeaders;
	}

	/**
	 * Fetch a resource using its id
	 * @param {string} id
	 * @return {Thing}
	 */
	async fetchResource(id) {
		const json = await this.client.get(id, this.authorizationHeaders);

		const {thing, embeddedThings} = this.parser.parseThing(json);

		this.updateCache(thing, embeddedThings);

		return thing;
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
}
