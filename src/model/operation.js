/**
 * Model that represent an operation on a resource
 */
export default class Operation {
	/**
	 * Creates a new Operation
	 * @param {String} id
	 * @param {String} target
	 * @param {String} method
	 * @param {String} expects
	 * @param {Array<String>} type
	 * @param {Form} form
	 */
	constructor(id, target, method, expects, type, form = null) {
		this.id = id;
		this.target = target;
		this.method = method;
		this.expects = expects;
		this.type = type;
		this.form = form;
	}
}
