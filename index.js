import * as d3 from "d3";

/**
 * d3-x3dom
 *
 * @author James Saunders [james@saunders-family.net]
 * @copyright Copyright (C) 2019 James Saunders
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

export default {
	version: version,
	author: author,
	copyright: copyright,
	license: license,
	chart: chart,
	component: component,
	dataTransform: dataTransform,
	randomData: randomData,
	events: events
};
