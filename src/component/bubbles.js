import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable 3D Bubble Chart
 *
 * @module
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
	 *
	 * @param {Array} data - Chart data.
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
	 *
	 * @constructor
	 * @param {d3.selection} selection
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
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.zScale = function(_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Color Scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _ - Color 'red' or '#ff0000'.
	 * @returns {*}
	 */
	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return this;
	};

	return my;
}
