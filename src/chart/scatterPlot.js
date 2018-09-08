import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as component } from "../component";

/**
 * Reusable 3D Scatter Plot
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 40.0;
	let height = 40.0;
	let depth = 40.0;
	let color = "orange";
	let classed = "x3dScatterPlot";

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
		let maxX = d3.max(data, function(d) { return +d.x; });
		let maxY = d3.max(data, function(d) { return +d.y; });
		let maxZ = d3.max(data, function(d) { return +d.z; });

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleLinear().domain([0, maxX]).range([0, width]) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxY]).range([0, height]) :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleLinear().domain([0, maxZ]).range([0, depth]) :
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

			// Construct Bubbles Component
			let chart = component.bubbles()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.color(color);

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

	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return my;
	};

	return my;
}
