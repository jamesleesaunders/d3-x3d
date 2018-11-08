import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";

let banner = `/**
 * d3-x3dom
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */
`;

export default {
	input: "index.js",
	output: {
		file: "build/d3-x3dom.js",
		format: "umd",
		extend: true,
		name: "d3.x3dom",
		banner: banner,
		strict: true,
		globals: { d3: "d3" }
	},
	external: ["d3"],
	plugins: [
		babel({
			exclude: ["node_modules/**", "*.json"],
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
