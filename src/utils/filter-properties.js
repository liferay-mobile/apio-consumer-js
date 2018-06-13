const filterProperties = (object, ...properties) => {
	const keys = Object.keys(object).filter(
		key => properties.indexOf(key) === -1
	);

	return keys.reduce((acc, x) => {
		acc[x] = object[x];
		return acc;
	}, {});
};

export {filterProperties};
