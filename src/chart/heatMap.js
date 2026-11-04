import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { sceneChart } from "./sceneChart.js";

/**
 * Reusable 3D Heat Map
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.heatMap();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/heat-map/
 *
 * @param {number} width - X3D canvas width in px.
 * @param {number} height - X3D canvas height in px.
 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
 * @param {d3.scale} xScale - D3 scale.
 * @param {d3.scale} yScale - D3 scale.
 * @param {d3.scale} zScale - D3 scale.
 * @param {d3.scale} colorScale - D3 color scale.
 * @param {Array} colors - Array of colours used by color scale.
 * @param {string} labelPosition - Position ("proximal" or "distal")
 * @param {boolean} debug - Show debug log and stats. True/False.
 */
export default function() {
	return sceneChart({
		classed: "d3X3dHeatMap",
		layers: ["axis", "bars"],
		markLayer: ".bars",
		light: true,
		state: {
			width: 500,
			height: 500,
			dimensions: { x: 40, y: 20, z: 40 },
			colors: ["#1e253f", "#e33b30"],
			labelPosition: "distal",
			debug: false,
			xScale: undefined,
			yScale: undefined,
			zScale: undefined,
			colorScale: undefined
		},
		axis: () => component.axisThreePlane(),
		mark: () => component.heatMap(),
		init(data, chartState) {
			const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
			const valueExtent = [0, valueMax];
			const { x: dimensionX, y: dimensionY, z: dimensionZ } = chartState.dimensions;

			chartState.xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, dimensionX])
				.paddingOuter(0.5)
				.paddingInner(0.1)
				.align(1);

			chartState.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY])
				.nice();

			chartState.zScale = d3.scaleBand()
				.domain(rowKeys.reverse())
				.range([0, dimensionZ])
				.paddingOuter(0.5)
				.paddingInner(0.1)
				.align(1);

			chartState.colorScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(chartState.colors);
		},
		configureAxis(axis, chartState) {
			axis.labelPosition(chartState.labelPosition);
		},
		configureMark(mark, chartState) {
			mark.colors(chartState.colors);
		}
	});
}
