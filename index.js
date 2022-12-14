/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2022 James Saunders
 * @license GPLv2
 */

const author = "James Saunders";
const year = new Date().getFullYear();
const copyright = `Copyright (C) ${year} ${author}`;

// import {default as packageJson} from "./package.json" assert { type: "json" };
// let version = packageJson.version;
// let license = packageJson.license;
let version = "2.1.4";
let license = "GPL-2.0";

import chart from "./src/chart.js";
import component from "./src/component.js";
import dataTransform from "./src/dataTransform.js";
import * as randomData from "./src/randomData.js";
import * as events from "./src/events.js";
import * as colorHelper from "./src/colorHelper.js"

export default {
	version: version,
	author: author,
	copyright: copyright,
	license: license,
	chart: chart,
	component: component,
	dataTransform: dataTransform,
	randomData: randomData,
	events: events,
	colorHelper: colorHelper
};
