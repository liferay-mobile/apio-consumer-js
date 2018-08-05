/**
 * Model that represent an entity returned by APIO
 * @review
 */
export default class Thing {
	/**
	 * Creates a new Thing
	 * @param {String} id
	 * @param {(Array<String>|String)} types
	 * @param {object} attributes
	 * @param {object} operations
	 * @review
	 */
	constructor(id, types, attributes, operations) {
		this.id = id;
		this.types = this.normalizeTypes(types);
		this.attributes = attributes;
		this.operations = operations;
	}

	/**
	 * Check wether the thing is a concrete type or not.
	 * @param {string} type
	 * @return {boolean}
	 * @review
	 */
	hasType(type) {
		return this.types.indexOf(type) !== -1;
	}

	/**
	 * Types can be an array or a string, this function transform
	 * it to return an array always.
	 * @param {Array<String>|String} types
	 * @return {Array<String>}
	 * @review
	 */
	normalizeTypes(types) {
		return [].concat(types);
	}
}
