import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable 3D Bubble Chart
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
	let classed = "x3dBubbles";

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
		let scene = selection;
		scene.classed(classed, true);

		selection.each(function(data) {
			init(data);

			let makeSolid = function(selection, color) {
				selection
					.append("appearance")
					.append("material")
					.attr("diffuseColor", color || "black");
				return selection;
			};

			let bubblesSelect = scene.selectAll(".point")
				.data(data);

			let bubbles = bubblesSelect.enter()
				.append("transform")
				.attr("class", "point")
				.attr("translation", function(d) { return xScale(d.x) + ' ' + yScale(d.y) + ' ' + zScale(d.z); })
				.attr("onmouseover", "d3.select(this).select('billboard').attr('render', true);")
				.attr("onmouseout", "d3.select(this).select('transform').select('billboard').attr('render', false);")
				.merge(bubblesSelect);

			bubbles.append("shape")
				.call(makeSolid, color)
				.append("sphere")
				.attr("radius", 0.6);

			bubbles
				.append("transform")
				.attr('translation', "0.8 0.8 0.8")
				.append("billboard")
				.attr('render', false)
				.attr("axisOfRotation", "0 0 0")
				.append("shape")
				.call(makeSolid, "blue")
				.append("text")
				.attr('class', "labelText")
				.attr('string', function(d) { return d.x + ', ' + d.y + ', ' + d.z; })
				.append("fontstyle")
				.attr("size", 1)
				.attr("family", "SANS")
				.attr("style", "BOLD")
				.attr("justify", "START")
				.attr('render', false);
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
		return this;
	};

	return my;
}
