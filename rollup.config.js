import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/index.js',
	output: {
		name: 'modapp-base-component',
		format: 'umd',
		exports: 'named'
	},
	plugins: [
		babel({ babelHelpers: 'bundled' }),
		resolve(),
		(process.env.NODE_ENV === 'production' && terser()),
	],
};
