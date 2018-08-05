/**
 * Model that represent an APIO form
 * @review
 */
export default class Form {
	/**
	 * Creates a new Operation
	 * @param {String} id
	 * @param {String} title
	 * @param {String} description
	 * @param {Array<Object>} properties
	 * @review
	 */
	constructor(id, title, description, properties) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.properties = properties;
	}
}
