/**
 * Model that represent an APIO form
 */
export default class Form {
	/**
	 * Creates a new Operation
	 * @param {String} id
	 * @param {String} title
	 * @param {String} description
	 * @param {Array<Object>} properties
	 */
	constructor(id, title, description, properties) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.properties = properties;
	}
}
