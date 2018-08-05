/**
 * Model that represent a relation between an id and a thing
 * @review
 */
export default class Relation {
	/**
	 * Creates a new Relation
	 * @param {String} id
	 * @param {Thing} thing
	 * @review
	 */
	constructor(id, thing) {
		this.id = id;
		this.thing = thing;
	}
}
