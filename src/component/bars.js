import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Bar Chart
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 2 };
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "x3dBars";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

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

			let bars = selection.selectAll(".bar")
				.data(function(d) { return d.values; });

			let barsEnter = bars.enter()
				.append("transform")
				.classed("bar", true)
				.attr("scale", function(d) {
					let x = xScale.bandwidth();
					let y = yScale(d.value);
					let z = dimensions.z;
					return x + " " + y + " " + z;
				})
				.attr("translation", function(d) {
					let x = xScale(d.key);
					let y = yScale(d.value) / 2;
					let z = 0.0;
					return x + " " + y + " " + z;
				})
				.append("shape")
				.merge(bars);

			barsEnter.append("box")
				.attr("size", "1.0 1.0 1.0");
			barsEnter.append("appearance")
				.append("material")
				.attr("diffuseColor", function(d) {
					return colorScale(d.key);
				})
				.attr("ambientIntensity", "0.1");

			bars.transition()
				.attr("scale", function(d) {
					let x = xScale.bandwidth();
					let y = yScale(d.value);
					let z = dimensions.z;
					return x + " " + y + " " + z;
				})
				.attr("translation", function(d) {
					let x = xScale(d.key);
					let y = yScale(d.value) / 2;
					let z = 0.0;
					return x + " " + y + " " + z;
				});
		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _ - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}
