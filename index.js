/**
 * d3-x3d
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2021 James Saunders
 * @license GPLv2
 */

const author = "James Saunders";
const year = new Date().getFullYear();
const copyright = `Copyright (C) ${year} ${author}`;
import { version, license } from "./package.json";

import chart from "./src/chart";
import component from "./src/component";
import dataTransform from "./src/dataTransform";
import * as randomData from "./src/randomData";
import * as events from "./src/events";
import * as colorHelper from "./src/colorHelper"

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
