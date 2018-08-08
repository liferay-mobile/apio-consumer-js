import EntryPoint from '../model/entrypoint';

const entryPointConverter = thing => {
	const id = thing.id;
	const types = thing.types;
	const collections = thing.attributes.collection.map(col => {
		const collectionThing = col.thing;
		const managingType = collectionThing.attributes.manages.object;
		const normalizedManagingType = managingType.replace('schema:', '');

		return {id: col.id, manages: normalizedManagingType};
	});

	return new EntryPoint(id, types, collections);
};

export {entryPointConverter};
