import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { createScene } from "../base.js";

/**
 * Reusable 3D Bubble Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.bubbleChart();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/bubble-chart/
 */
export default function() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["green", "red", "yellow", "steelblue", "orange"];
	let sizeRange = [0.5, 3.5];
	let classed = "d3X3dBubbleChart";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.axisThreePlane();
	const bubbles = component.bubblesMultiSeries();
	const light = component.light();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { valueExtent, coordinatesExtent, rowKeys } = dataTransform(data).summary();
		const { x: extentX, y: extentY, z: extentZ } = coordinatesExtent;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		xScale = d3.scaleLinear()
			.domain(extentX)
			.range([0, dimensionX]);

		yScale = d3.scaleLinear()
			.domain(extentY)
			.range([0, dimensionY]);

		zScale = d3.scaleLinear()
			.domain(extentZ)
			.range([0, dimensionZ]);

		colorScale = d3.scaleOrdinal()
			.domain(rowKeys)
			.range(colors);

		sizeScale = d3.scaleLinear()
			.domain(valueExtent)
			.range(sizeRange);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bubbleChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "bubbles"];
		const scene = createScene(selection, layers, classed, width, height, debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			scene.select(".axis")
				.call(axis);

			// Add Bubbles
			bubbles.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.sizeScale(sizeScale)
				.colorScale(colorScale);

			scene.select(".bubbles")
				.datum(data)
				.call(bubbles);

			// Add Light
			scene.call(light);
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
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Size Range Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [0.5, 3.0]).
	 * @returns {*}
	 */
	my.sizeRange = function(_v) {
		if (!arguments.length) return sizeRange;
		sizeRange = _v;
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
