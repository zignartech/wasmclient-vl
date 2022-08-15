import { terser } from 'rollup-plugin-terser';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import resolve from 'rollup-plugin-node-resolve';
import ts from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';
import empty from "rollup-plugin-empty";

const prodMode = process.env.NODE_ENV === 'production';

/**
 *
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: 'src/index.ts',
	output: {
		file: 'dist/wasmclient.js',
		format: 'module',
		name: 'wasmclient',
		sourcemap: true,
	},
	cache: false,
	external: ['tweetnacl','base64-js','blakejs','ieee754'],
	plugins: [
		resolve({
			browser: true,
			main: true,
			jsnext: true,
			preferBuiltins: false
		}),
		commonjs(),
		ts(),
		empty({
			silent: false,
			dir: 'dist',
		}),
	],
};
if (prodMode) {
	config.plugins.push(terser());
}

export default config;
