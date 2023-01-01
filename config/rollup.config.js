import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import resolve from '@rollup/plugin-node-resolve';

let banner = `/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2023 James Saunders
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
		babel({ babelHelpers: 'bundled' }),
		json({ compact: true, exclude: ["node_modules/**"] }),
		resolve({})
	]
};
