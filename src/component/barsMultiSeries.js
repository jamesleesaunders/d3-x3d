import * as d3 from "d3";
import dataTransform from "../dataTransform";
import componentBars from "./bars";

/**
 * Reusable 3D Multi Series Bar Chart
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "x3dBarsMultiSeries";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const dataSummary = dataTransform(data).summary();
		const categoryNames = dataSummary.rowKeys;
		const seriesNames = dataSummary.columnKeys;
		const maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).rangeRound([0, dimensions.x]).padding(0.5) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]) :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleBand().domain(categoryNames).range([0, dimensions.z]).padding(0.7) :
			zScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barsMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			// Construct Bars Component
			const bars = componentBars()
				.xScale(xScale)
				.yScale(yScale)
				.dimensions({
					x: dimensions.x,
					y: dimensions.y,
					z: zScale.bandwidth()
				})
				.colors(colors);

			// Create Bar Groups
			const barGroup = selection.selectAll(".barGroup")
				.data(data);

			barGroup.enter()
				.append("transform")
				.classed("barGroup", true)
				.attr("translation", function(d) {
					let x = 0;
					let y = 0;
					let z = zScale(d.key);
					return x + " " + y + " " + z;
				})
				.append("group")
				.call(bars)
				.merge(barGroup);

			barGroup.exit()
				.remove();

		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} value - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(value) {
		if (!arguments.length) return dimensions;
		dimensions = value;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.xScale = function(value) {
		if (!arguments.length) return xScale;
		xScale = value;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.yScale = function(value) {
		if (!arguments.length) return yScale;
		yScale = value;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.zScale = function(value) {
		if (!arguments.length) return zScale;
		zScale = value;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Color Scale.
	 * @returns {*}
	 */
	my.colorScale = function(value) {
		if (!arguments.length) return colorScale;
		colorScale = value;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} value - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(value) {
		if (!arguments.length) return colors;
		colors = value;
		return my;
	};

	return my;
}
