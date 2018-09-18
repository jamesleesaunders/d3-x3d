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
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "orange";
	let classed = "x3dBubbles";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let sizeScale;

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		let maxX = d3.max(data.values, function(d) { return +d.x; });
		let maxY = d3.max(data.values, function(d) { return +d.y; });
		let maxZ = d3.max(data.values, function(d) { return +d.z; });
		let maxValue = d3.max(data.values, function(d) { return +d.value; });

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleLinear().domain([0, maxX]).range([0, dimensions.x]) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxY]).range([0, dimensions.y]) :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleLinear().domain([0, maxZ]).range([0, dimensions.z]) :
			zScale;

		sizeScale = (typeof sizeScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0.5, 3.0]) :
			sizeScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			let makeSolid = function(selection, color) {
				selection
					.append("appearance")
					.append("material")
					.attr("diffuseColor", color || "black");
				return selection;
			};

			let bubblesSelect = selection.selectAll(".point")
				.data(function(d) { return d.values; });

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
				.attr("radius", function(d) { return sizeScale(d.value); });

			bubbles
				.append("transform")
				.attr('translation', "0.8 0.8 0.8") // FIXME: transation should be proportional to the sphere radius.
				.append("billboard")
				.attr('render', false)
				.attr("axisOfRotation", "0 0 0")
				.append("shape")
				.call(makeSolid, "blue")
				.append("text")
				.attr('class', "labelText")
				.attr('string', function(d) { return d.key; })
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
	my.dimensions = function(_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
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

	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return my;
	};

	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};

	return my;
}
