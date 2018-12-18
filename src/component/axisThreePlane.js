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
			.attr("class", (d) => d);

		// Construct Axis Components
		const xzAxis = componentAxis()
			.scale(xScale)
			.direction("x")
			.tickDirection("z")
			.tickSize(zScale.range()[1] - zScale.range()[0])
			.tickPadding(xScale.range()[0])
			.color("blue");

		const yzAxis = componentAxis()
			.scale(yScale)
			.direction("y")
			.tickDirection("z")
			.tickSize(zScale.range()[1] - zScale.range()[0])
			.color("red");

		const yxAxis = componentAxis()
			.scale(yScale)
			.direction("y")
			.tickDirection("x")
			.tickSize(xScale.range()[1] - xScale.range()[0])
			.tickFormat("")
			.color("red");

		const zxAxis = componentAxis()
			.scale(zScale)
			.direction("z")
			.tickDirection("x")
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
	 * @param {{x: number, y: number, z: number}} _v - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_v) {
		if (!arguments.length) return dimensions;
		dimensions = _v;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_v) {
		if (!arguments.length) return xScale;
		xScale = _v;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
	 * @returns {*}
	 */
	my.zScale = function(_v) {
		if (!arguments.length) return zScale;
		zScale = _v;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_v) {
		if (!arguments.length) return colorScale;
		colorScale = _v;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _v - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_v) {
		if (!arguments.length) return colors;
		colors = _v;
		return my;
	};

	return my;
}
