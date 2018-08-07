import Collection from '../model/collection';

const collectionConverter = (thing, {conversionHandler}) => {
	const id = thing.id;
	const types = thing.types;
	const {
		view: {first, last, next},
		totalItems,
		numberOfItems,
		member,
	} = thing.attributes;

	let items =
		member.length === 0
			? []
			: member.map(item => conversionHandler.convert(item.thing));

	return new Collection(
		id,
		types,
		first,
		last,
		next,
		items,
		totalItems,
		numberOfItems
	);
};

export {collectionConverter};
