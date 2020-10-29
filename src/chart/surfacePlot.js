import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";
import { createScene } from "../base";

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
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red"];
	let classed = "d3X3dSurfacePlot";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

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
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		xScale = d3.scalePoint()
			.domain(rowKeys)
			.range([0, dimensionX]);

		yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([0, dimensionY]).nice();

		zScale = d3.scalePoint()
			.domain(columnKeys)
			.range([0, dimensionZ]);

		colorScale = d3.scaleLinear()
			.domain(valueExtent)
			.range(colors)
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
		const scene = createScene(selection, layers, classed, width, height, debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.labelPosition("distal");

			scene.select(".axis")
				.call(axis);

			// Add Surface Area
			surface.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colors(colors);

			scene.select(".surface")
				.datum(data)
				.call(surface);
		});
	};

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _v - X3D canvas width in px.
	 * @returns {*}
	 */
	my.width = function(_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _v - X3D canvas height in px.
	 * @returns {*}
	 */
	my.height = function(_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_v) {
		if (!arguments.length) return dimensions;
		dimensions = _v;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.zScale = function(_v) {
		if (!arguments.length) return zScale;
		zScale = _v;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _v - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	/**
	 * Debug Getter / Setter
	 *
	 * @param {boolean} _v - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function(_v) {
		if (!arguments.length) return debug;
		debug = _v;
		return my;
	};

	return my;
}
