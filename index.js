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
	chartBarChartMultiSeries: chart.barChartMultiSeries,
	chartBarChartVertical: chart.barChartVertical,
	chartBubbleChart: chart.bubbleChart,
	chartScatterPlot: chart.scatterPlot,
	chartSurfaceArea: chart.surfaceArea,
	component: component,
	componentAxis: component.axis,
	componentAxisThreePlane: component.axisThreePlane,
	componentBars: component.bars,
	componentBarsMultiSeries: component.barsMultiSeries,
	componentBubbles: component.bubbles,
	componentBubblesMultiSeries: component.bubblesMultiSeries,
	componentSurfaceArea: component.surfaceArea,
	componentViewpoint: component.viewpoint,
};
