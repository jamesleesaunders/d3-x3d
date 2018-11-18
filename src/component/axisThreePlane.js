import * as d3 from "d3";
import componentAxis from "./axis";

/**
 * Reusable 3D Multi Plane Axis Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red", "green"];
	let classed = "x3dAxisThreePlane";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias axisThreePlane
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {

		const layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
		selection.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		// Construct Axis Components
		const xzAxis = componentAxis()
			.scale(xScale)
			.dir("x")
			.tickDir("z")
			.tickSize(zScale.range()[1] - zScale.range()[0])
			.tickPadding(xScale.range()[0])
			.color("blue");

		const yzAxis = componentAxis()
			.scale(yScale)
			.dir("y")
			.tickDir("z")
			.tickSize(zScale.range()[1] - zScale.range()[0])
			.color("red");

		const yxAxis = componentAxis()
			.scale(yScale)
			.dir("y")
			.tickDir("x")
			.tickSize(xScale.range()[1] - xScale.range()[0])
			.tickFormat("")
			.color("red");

		const zxAxis = componentAxis()
			.scale(zScale)
			.dir("z")
			.tickDir("x")
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
	 * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.zScale = function(_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _x - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	return my;
}
