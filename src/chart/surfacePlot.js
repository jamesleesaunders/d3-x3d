import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

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
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["blue", "red"],
		debug: false,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dSurfacePlot";

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.axisThreePlane();
	const surface = component.surface();

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
			.domain(rowKeys)
			.range([0, dimensionX]);

		state.yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([0, dimensionY]).nice();

		state.zScale = d3.scalePoint()
			.domain(columnKeys)
			.range([0, dimensionZ]);

		state.colorScale = d3.scaleLinear()
			.domain(valueExtent)
			.range(state.colors)
			.interpolate(d3.interpolateLab);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias surfacePlot
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "surface"];
		const scene = createScene(selection, layers, classed, state.width, state.height, state.debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.labelPosition("distal");

			scene.select(".axis")
				.call(axis);

			// Add Surface Area
			surface.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.colors(state.colors);

			scene.select(".surface")
				.datum(data)
				.call(surface);
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
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
