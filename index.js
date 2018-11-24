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

import chart from "./src/chart";
import component from "./src/component";
import dataTransform from "./src/dataTransform";
import * as randomData from "./src/randomData";

export default {
	version: version,
	author: author,
	copyright: copyright,
	license: license,
	chart: chart,
	component: component,
	dataTransform: dataTransform,
	randomData: randomData
};
