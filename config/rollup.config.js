import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";

let banner = `/**
 * d3-x3dom
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2019 James Saunders
 * @license GPLv2
 */
`;

export default {
	input: "index.js",
	output: {
		file: "dist/d3-x3dom.js",
		format: "umd",
		extend: true,
		name: "d3.x3dom",
		banner: banner,
		strict: true,
		globals: { "d3": "d3", "x3dom": "x3dom", "d3-array": "d3", "d3-shape": "d3" }
	},
	external: ["d3", "x3dom", "d3-shape", "d3-array"],
	plugins: [
		babel({
			include: ["index.js", "src/**", "node_modules/d3-interpolate-curve/**"],
			babelrc: false,
			presets: [["env", { modules: false }]],
			plugins: [
				"external-helpers",
				"transform-object-assign"
			]
		}),
		json({
			exclude: ["node_modules/**"]
		})
	]
};
