import Form from '../model/form';

const formConverter = thing => {
	const id = thing.id;
	const title = thing.attributes.title;
	const description = thing.attributes.description;

	const properties = thing.attributes.supportedProperty.map(property => {
		const name = property.property;
		const required = property.required;

		return {name, required};
	});

	return new Form(id, title, description, properties);
};

export {formConverter};
