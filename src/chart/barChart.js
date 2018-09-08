import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as component } from "../component";

/**
 * Reusable 3D Bar Chart
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 40.0;
	let height = 40.0;
	let depth = 40.0;
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "x3dBarChart";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let dataSummary = dataTransform(data).summary();
		let categoryNames = dataSummary.rowKeys;
		let seriesNames = dataSummary.columnKeys;
		let maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(seriesNames).rangeRound([0, width]).padding(0.5) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, height]).nice() :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleBand().domain(categoryNames).range([0, depth]).padding(0.7) :
			zScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {

		// Update the chart dimensions and add layer groups
		let layers = ["axis", "chart"];
		selection.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		selection.each(function(data) {
			init(data);

			// Construct Axis Component
			let axis = component.axisMulti()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Bars Component
			let chart = component.barsMulti()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colors(colors);

			selection.select(".axis")
				.call(axis);

			selection.select(".chart")
				.datum(data)
				.call(chart);
		});
	}

	/**
	 * Configuration Getters & Setters
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	my.depth = function(_) {
		if (!arguments.length) return depth;
		depth = _;
		return this;
	};

	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	my.zScale = function(_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}
