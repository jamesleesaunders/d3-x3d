import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as componentAxis } from "./axis";

/**
 * Reusable 3D Multi Plane Axis
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red", "green"];
	let classed = "x3dAxisThreePlane";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
	 */
	function my(selection) {

		let layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
		selection.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		// Construct Axis Components
		let xzAxis = componentAxis()
			.scale(xScale)
			.dir('x')
			.tickDir('z')
			.tickSize(zScale.range()[1] - zScale.range()[0])
			.tickPadding(xScale.range()[0])
			.color("blue");

		let yzAxis = componentAxis()
			.scale(yScale)
			.dir('y')
			.tickDir('z')
			.tickSize(zScale.range()[1] - zScale.range()[0])
			.color("red");

		let yxAxis = componentAxis()
			.scale(yScale)
			.dir('y')
			.tickDir('x')
			.tickSize(xScale.range()[1] - xScale.range()[0])
			.tickFormat("")
			.color("red");

		let zxAxis = componentAxis()
			.scale(zScale)
			.dir('z')
			.tickDir('x')
			.tickSize(xScale.range()[1] - xScale.range()[0])
			.color("black");

		selection.select(".xzAxis")
			.call(xzAxis);

		selection.select(".yzAxis")
			.call(yzAxis);

		selection.select(".yxAxis")
			.call(yxAxis);

		selection.select(".zxAxis")
			.call(zxAxis);

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
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Color Scale.
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
