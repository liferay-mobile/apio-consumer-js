import {isObject} from './is-object';

const isObjectArray = value =>
	Array.isArray(value) && value.length > 0 && isObject(value[0]);

export {isObjectArray};
