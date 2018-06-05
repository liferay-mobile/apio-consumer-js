import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
	input: 'src/main.js',
	output: {
		name: 'ApioConsumer',
		file: 'build/apio-consumer-bundle.js',
		format: 'umd'
	},
	plugins: [
		nodeResolve(),
		commonjs(),
		babel({
			plugins: ['transform-runtime'],
			runtimeHelpers: true,
			exclude: 'node_modules/**'
		}),
	]
};
