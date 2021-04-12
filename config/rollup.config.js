import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import resolve from '@rollup/plugin-node-resolve';

let banner = `/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2021 James Saunders
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
		globals: { "d3": "d3", "d3-array": "d3", "d3-shape": "d3", "d3-interpolate": "d3" }
	},
	external: ["d3", "d3-array", "d3-shape", "d3-interpolate"],
	plugins: [
		babel({
			include: ["index.js", "src/**", "node_modules/d3-interpolate-curve/**"],
			babelrc: false,
			presets: [["@babel/env", { modules: false }]],
			plugins: [
				"@babel/transform-object-assign"
			],
			babelHelpers: 'bundled',
		}),
		json({
			exclude: ["node_modules/**"]
		}),
		resolve({})
	]
};
