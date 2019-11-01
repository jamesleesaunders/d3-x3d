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
	let classed = "d3X3dAxisThreePlane";
	let labelPosition = "proximal";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;

	/* Components */
	const xzAxis = componentAxis();
	const yzAxis = componentAxis();
	const yxAxis = componentAxis();
	const zxAxis = componentAxis();

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias axisThreePlane
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function() {

			const element = d3.select(this)
				.classed(classed, true);

			const layers = ["xzAxis", "yzAxis", "yxAxis", "zxAxis"];
			element.selectAll("group")
				.data(layers)
				.enter()
				.append("Group")
				.attr("class", (d) => d);

			xzAxis.scale(xScale)
				.direction("x")
				.tickDirection("z")
				.tickSize(zScale.range()[1] - zScale.range()[0])
				.color("blue")
				.labelPosition(labelPosition);

			yzAxis.scale(yScale)
				.direction("y")
				.tickDirection("z")
				.tickSize(zScale.range()[1] - zScale.range()[0])
				.color("red")
				.labelPosition(labelPosition);

			yxAxis.scale(yScale)
				.direction("y")
				.tickDirection("x")
				.tickSize(xScale.range()[1] - xScale.range()[0])
				.color("red")
				.labelPosition(labelPosition);

			zxAxis.scale(zScale)
				.direction("z")
				.tickDirection("x")
				.tickSize(xScale.range()[1] - xScale.range()[0])
				.color("black")
				.labelPosition(labelPosition);

			// We only want 2 sets of labels on the y axis if they are in distal position.
			if (labelPosition === "proximal") {
				yxAxis.tickFormat("");
			} else {
				yxAxis.tickFormat((d) => d);
			}

			element.select(".xzAxis")
				.call(xzAxis);

			element.select(".yzAxis")
				.call(yzAxis);

			element.select(".yxAxis")
				.call(yxAxis);

			element.select(".zxAxis")
				.call(zxAxis);
		});
	};

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

	/**
	 * Label Position Getter / Setter
	 *
	 * @param {string} _v - Position ("proximal" or "distal")
	 * @returns {*}
	 */
	my.labelPosition = function(_v) {
		if (!arguments.length) return labelPosition;
		labelPosition = _v;
		return my;
	};

	return my;
}
