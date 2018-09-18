import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as componentAxis } from "./axis";

/**
 * Reusable 3D Multi Plane Axis
 *
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red", "green"];
	let classed = "x3dAxisMulti";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Constructor
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
			.tickSize(xScale.range()[1] - xScale.range()[0])
			.tickPadding(xScale.range()[0])
			.color("blue")
			.dimensions(dimensions);

		let yzAxis = componentAxis()
			.scale(yScale)
			.dir('y')
			.tickDir('z')
			.tickSize(yScale.range()[1] - yScale.range()[0])
			.color("red")
			.dimensions(dimensions);

		let yxAxis = componentAxis()
			.scale(yScale)
			.dir('y')
			.tickDir('x')
			.tickSize(yScale.range()[1] - yScale.range()[0])
			.tickFormat(function() { return ''; })
			.color("red")
			.dimensions(dimensions);

		let zxAxis = componentAxis()
			.scale(zScale)
			.dir('z')
			.tickDir('x')
			.tickSize(zScale.range()[1] - zScale.range()[0])
			.color("black")
			.dimensions(dimensions);

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
