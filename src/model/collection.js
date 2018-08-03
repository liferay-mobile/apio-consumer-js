/**
 * Model that represent an APIO collection
 */
export default class Collection {
	/**
	 * Creates a new Collection
	 * @param {String} id
	 * @param {Array<Object>} type
	 * @param {String} first
	 * @param {String} last
	 * @param {String} next
	 * @param {Array<Thing>} items
	 * @param {number} totalItems
	 * @param {number} numberOfItems
	 */
	constructor(id, type, first, last, next, items, totalItems, numberOfItems) {
		this.id = id;
		this.type = type;
		this.first = first;
		this.last = last;
		this.next = next;
		this.items = items;
		this.totalItems = totalItems;
		this.numberOfItems = numberOfItems;
	}

	/**
	 * Checks wether this collection has another page with more items
	 * @return {boolean}
	 */
	hasNext() {
		return this.next != null;
	}
}
