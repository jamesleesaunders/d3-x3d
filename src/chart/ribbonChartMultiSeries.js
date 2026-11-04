import * as d3 from "d3";
import component from "../component.js";
import { sceneChart, initColumnPointScales, orientSeriesViewpoint } from "./sceneChart.js";

/**
 * Reusable 3D Multi Series Ribbon Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.ribbonChartMultiSeries();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/waterfall-plot/
 *
 * @param {number} width - X3D canvas width in px.
 * @param {number} height - X3D canvas height in px.
 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
 * @param {d3.scale} xScale - D3 scale.
 * @param {d3.scale} yScale - D3 scale.
 * @param {d3.scale} zScale - D3 scale.
 * @param {d3.scale} colorScale - D3 color scale.
 * @param {Array} colors - Array of colours used by color scale.
 * @param {d3.curve} smoothed
 * @param {boolean} debug - Show debug log and stats. True/False.
 */
export default function() {
	return sceneChart({
		classed: "d3X3dRibbonChartMultiSeries",
		layers: ["axis", "ribbons"],
		markLayer: ".ribbons",
		light: true,
		state: {
			width: 500,
			height: 500,
			dimensions: { x: 60, y: 40, z: 40 },
			colors: ["green", "red", "yellow", "steelblue", "orange"],
			debug: false,
			smoothed: d3.curveBasis,
			xScale: undefined,
			yScale: undefined,
			zScale: undefined,
			colorScale: undefined
		},
		axis: () => component.axisThreePlane(),
		mark: () => component.ribbonMultiSeries(),
		init: initColumnPointScales,
		viewpoint: orientSeriesViewpoint,
		configureMark(mark, chartState) {
			mark.colors(chartState.colors)
				.smoothed(chartState.smoothed)
				.dimensions(chartState.dimensions);
		}
	});
}
