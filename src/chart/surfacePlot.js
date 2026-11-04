import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { sceneChart } from "./sceneChart.js";

/**
 * Reusable 3D Surface Plot Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.surfacePlot();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/three-dimensional-stream-graph/
 *
 * @param {number} width - X3D canvas width in px.
 * @param {number} height - X3D canvas height in px.
 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
 * @param {d3.scale} xScale - D3 scale.
 * @param {d3.scale} yScale - D3 scale.
 * @param {d3.scale} zScale - D3 scale.
 * @param {d3.scale} colorScale - D3 color scale.
 * @param {Array} colors - Array of colours used by color scale.
 * @param {boolean} debug - Show debug log and stats. True/False.
 */
export default function() {
	return sceneChart({
		classed: "d3X3dSurfacePlot",
		layers: ["axis", "surface"],
		markLayer: ".surface",
		state: {
			width: 500,
			height: 500,
			dimensions: { x: 40, y: 40, z: 40 },
			colors: ["blue", "red"],
			debug: false,
			xScale: undefined,
			yScale: undefined,
			zScale: undefined,
			colorScale: undefined
		},
		axis: () => component.axisThreePlane(),
		mark: () => component.surface(),
		init(data, chartState) {
			const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
			const valueExtent = [0, valueMax];
			const { x: dimensionX, y: dimensionY, z: dimensionZ } = chartState.dimensions;

			chartState.xScale = d3.scalePoint()
				.domain(rowKeys)
				.range([0, dimensionX]);

			chartState.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]).nice();

			chartState.zScale = d3.scalePoint()
				.domain(columnKeys)
				.range([0, dimensionZ]);

			chartState.colorScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(chartState.colors)
				.interpolate(d3.interpolateLab);
		},
		configureAxis(axis) {
			axis.labelPosition("distal");
		},
		configureMark(mark, chartState) {
			mark.colors(chartState.colors);
		}
	});
}
