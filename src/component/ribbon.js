import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Ribbon Chart
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "red";
	let classed = "x3dRibbon";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const dataSummary = dataTransform(data).summary();
		const seriesNames = dataSummary.columnKeys;
		const maxValue = dataSummary.maxValue;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).rangeRound([0, dimensions.x]).padding(0.3) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]) :
			yScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			const ribbonSelect = selection.selectAll(".point")
				.data(function(d) { return d.values; });

			const ribbon = ribbonSelect.enter()
				.append("transform")
				.attr("translation", function(d) {
					const x = xScale(d.key);
					const y = yScale(d.value) / 2;
					return x + " " + y + " 0";
				})
				.attr("rotation", function() {
					return "0,-1,0,1.57079633";
				})
				.append("shape");

			ribbon.append("rectangle2d")
				.attr("size", function(d) {
					const width = 5;
					const height = yScale(d.value);
					return width + " " + height;
				})
				.attr("solid", "true");

			ribbon.append("appearance")
				.append("twosidedmaterial")
				.attr("diffuseColor", color);
		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} value - 3D Object dimensions.
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
	 * Color Getter / Setter
	 *
	 * @param {string} value - Color 'red' or '#ff0000'.
	 * @returns {*}
	 */
	my.color = function(value) {
		if (!arguments.length) return color;
		color = value;
		return this;
	};

	return my;
}
