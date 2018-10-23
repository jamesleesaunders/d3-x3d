import { default as chartSurfaceArea } from "./src/chart/surfaceArea";

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

import { default as dataTransform } from "./src/dataTransform";
import { default as chart } from "./src/chart";
import { default as component } from "./src/component";

export default {
	version: version,
	author: author,
	copyright: copyright,
	license: license,
	dataTransform: dataTransform,
	chart: chart,
	component: component
};
