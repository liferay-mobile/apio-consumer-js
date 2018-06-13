/**
 * Model that represent an entity returned by APIO
 */
export default class Thing {
	/**
	 * Creates a new Thing
	 * @param {String} id
	 * @param {Array<String>} types
	 * @param {Object} attributes
	 * @param {Object} operations
	 */
	constructor(id, types, attributes, operations) {
		this.id = id;
		this.types = types;
		this.attributes = attributes;
		this.operations = operations;
	}
}
