import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Multi Series Area Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.areaChartMultiSeries();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/nested-area-chart/
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 60, y: 40, z: 40 },
		colors: ["green", "red", "yellow", "steelblue", "orange"],
		debug: false,
		smoothed: d3.curveMonotoneX,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dAreaChartMultiSeries";

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.axisThreePlane().labelPosition("distal");
	const areas = component.areaMultiSeries();
	const light = component.light();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

		state.xScale = d3.scalePoint()
			.domain(columnKeys)
			.range([0, dimensionX]);

		state.yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([0, dimensionY])
			.nice();

		state.zScale = d3.scaleBand()
			.domain(rowKeys)
			.range([0, dimensionZ])
			.padding(0.4);

		state.colorScale = d3.scaleOrdinal()
			.domain(columnKeys)
			.range(state.colors);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias areaChartMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "areas"];
		const scene = createScene(selection, layers, classed, state.width, state.height, state.debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2])
				.viewOrientation([-0.61021, 0.77568, 0.16115, 0.65629])
				.viewPosition([77.63865, 54.69470, 104.38314]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale);

			scene.select(".axis")
				.call(axis);

			// Add Areas
			areas.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.colors(state.colors)
				.smoothed(state.smoothed)
				.dimensions(state.dimensions);

			scene.select(".areas")
				.datum(data)
				.call(areas);

			// Add Light
			scene.call(light);
		});
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
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
	attachAccessors(my, state);

	return my;
}
