/**
 * Model that represent an entity returned by APIO
 */
export default class Thing {
	/**
	 * Creates a new Thing
	 * @param {String} id
	 * @param {(Array<String>|String)} types
	 * @param {object} attributes
	 * @param {object} operations
	 */
	constructor(id, types, attributes, operations) {
		this.id = id;
		this.types = this.normalizeTypes(types);
		this.attributes = attributes;
		this.operations = operations;
	}

	/**
	 * Types can be an array or a string, this function transform
	 * it to return an array always.
	 * @param {Array<String>|String} types
	 * @return {Array<String>}
	 */
	normalizeTypes(types) {
		return [].concat(types);
	}
}
