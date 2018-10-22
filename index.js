/**
 * d3-x3dom
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2018 James Saunders
 * @license GPLv2
 */

let author = "James Saunders";
let date = new Date();
let copyright = "Copyright (C) " + date.getFullYear() + " " + author;
import { version, license } from "./package.json";

import { default as chart } from "./src/chart";
import { default as component } from "./src/component";
import { default as dataTransform } from "./src/dataTransform";

export default {
	version: version,
	author: author,
	copyright: copyright,
	license: license,
	chart: chart,
	component: component,
	dataTransform: dataTransform
};
