import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
	input: 'src/index.js',
	output: {
		format: 'umd',
		name: 'modapp-base-component',
		exports: 'named'
	},
	plugins: [
		resolve({
			mainFields: [ 'jsnext:main', 'main', 'browser' ]
		}),
		babel({
			exclude: 'node_modules/**'
		}),
		commonjs(),
		(process.env.NODE_ENV === 'production' && uglify()),
	],
};
