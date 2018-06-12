import HttpClient from '../http/client';
import JsonLDParser from '../parser/jsonldparser';
import {formConverter} from '../converters';

/**
 * Apio consumer
 */
export default class ApioConsumer {
	/**
	 * Creates a new ApioConsumer
	 * @param {Object} authorizationHeaders
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

		const {thing, embbededThings} = this.parser.parseThing(json);

		this.updateCache(thing, embbededThings);

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
	 * Update the local cache of things
	 * @param {Thing} thing
	 * @param {Object} embbededThings
	 */
	updateCache(thing, embbededThings) {
		this.thingsCache.set(thing.id, thing);

		for (const key of Object.keys(embbededThings)) {
			this.thingsCache.set(key, embbededThings[key]);
		}
	}
}