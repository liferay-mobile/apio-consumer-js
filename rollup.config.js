import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default [
	{
		input: 'src/index.js',
		output: {
			name: 'ApioConsumer',
			file: 'build/apio-consumer-browser.js',
			format: 'iife',
		},
		plugins: [
			nodeResolve({
				browser: true,
			}),
			commonjs(),
			babel({
				plugins: ['transform-runtime'],
				runtimeHelpers: true,
				exclude: 'node_modules/**',
			}),
		],
	},
	{
		input: 'src/index.js',
		output: {
			name: 'ApioConsumer',
			file: 'build/apio-consumer-node.js',
			format: 'cjs',
		},
		plugins: [
			nodeResolve(),
			commonjs(),
			babel({
				plugins: ['transform-runtime'],
				runtimeHelpers: true,
				exclude: 'node_modules/**',
			}),
		],
	},
];
