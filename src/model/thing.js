/**
 * Model that represent an entity returned by APIO
 */
export default class Thing {
	/**
	 * Creates a new Thing
	 * @param {String} id
	 * @param {Array<String>} types
	 * @param {object} attributes
	 * @param {object} operations
	 */
	constructor(id, types, attributes, operations) {
		this.id = id;
		this.types = types;
		this.attributes = attributes;
		this.operations = operations;
	}
}
