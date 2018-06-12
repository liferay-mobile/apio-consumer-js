/**
 * Model that represent a relation between an id and a thing
 */
export default class Relation {
	/**
	 * Creates a new Relation
	 * @param {String} id
	 * @param {Thing} thing
	 */
	constructor(id, thing) {
		this.id = id;
		this.thing = thing;
	}
}
