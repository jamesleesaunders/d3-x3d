import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as componentBubbles } from "./bubbles";

/**
 * Reusable 3D Multi Series Bubble Chart
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
	let classed = "x3dBubblesMulti";

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
		let categoryNames = dataSummary.columnKeys;
		let maxCoordinates = dataSummary.maxCoordinates;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(categoryNames).range(colors) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, width]) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, height]) :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, depth]) :
			zScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			// Construct Bars Component
			let bubbles = componentBubbles()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.color(function(d) { return colorScale(d.key); });

			// Create Bar Groups
			let bubbleGroup = selection.selectAll(".bubbleGroup")
				.data(data);

			bubbleGroup.enter()
				.append("group")
				.classed("bubbleGroup", true)
				.call(bubbles)
				.merge(bubbleGroup);

			bubbleGroup.exit()
				.remove();

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
