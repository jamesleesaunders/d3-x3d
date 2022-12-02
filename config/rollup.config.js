import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import resolve from '@rollup/plugin-node-resolve';

let banner = `/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2022 James Saunders
 * @license GPLv2
 */
`;

export default {
	input: "index.js",
	output: {
		file: "dist/d3-x3d.js",
		format: "umd",
		extend: true,
		name: "d3.x3d",
		banner: banner,
		strict: true,
		globals: { "d3": "d3" }
	},
	external: ["d3"],
	plugins: [
		babel({
			include: ["index.js", "src/**"],
			babelrc: false,
			presets: [["@babel/env", { modules: false }]],
			plugins: [
				"@babel/transform-object-assign",
				"@babel/plugin-syntax-import-assertions"
			],
			babelHelpers: 'bundled'
		}),
		json({
			exclude: ["node_modules/**"]
		}),
		resolve({})
	]
};
