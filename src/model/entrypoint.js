/**
 * Model that represent the entry point of the API.
 * @review
 */
export default class EntryPoint {
	/**
	 * Construct a new entry point.
	 * @param {string} id
	 * @param {Array<string>} types
	 * @param {Array} collections
	 * @review
	 */
	constructor(id, types, collections) {
		this.id = id;
		this.types = types;
		this.collections = collections;
	}

	/**
	 * Get the collection that manages the type passed as an argument.
	 * @param {string} type
	 * @return {string} the id of the collection.
	 * @review
	 */
	getCollectionManaging(type) {
		const collectionsManagingType = this.collections.filter(
			collection => collection.manages === type
		);

		if (collectionsManagingType.length === 0) {
			throw new Error(`There is no collection managing ${type}`);
		}

		const collection = collectionsManagingType[0];

		return collection.id;
	}
}
