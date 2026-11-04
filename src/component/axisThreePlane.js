import * as d3 from "d3";
import componentAxis from "./axis.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Multi Plane Axis Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["blue", "red", "green"],
		labelPosition: "proximal",
		xScale: undefined,
		yScale: undefined,
		zScale: undefined
	};
	let classed = "d3X3dAxisThreePlane";

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

			xzAxis.scale(state.xScale)
				.direction("x")
				.tickDirection("z")
				.tickSize(state.zScale.range()[1] - state.zScale.range()[0])
				.color(state.colors[0])
				.labelPosition(state.labelPosition);

			yzAxis.scale(state.yScale)
				.direction("y")
				.tickDirection("z")
				.tickSize(state.zScale.range()[1] - state.zScale.range()[0])
				.color(state.colors[1])
				.labelPosition(state.labelPosition);

			yxAxis.scale(state.yScale)
				.direction("y")
				.tickDirection("x")
				.tickSize(state.xScale.range()[1] - state.xScale.range()[0])
				.color(state.colors[1])
				.labelPosition(state.labelPosition);

			zxAxis.scale(state.zScale)
				.direction("z")
				.tickDirection("x")
				.tickSize(state.xScale.range()[1] - state.xScale.range()[0])
				.color(state.colors[2])
				.labelPosition(state.labelPosition);

			// We only want 2 sets of labels on the y axis if they are in distal position.
			if (state.labelPosition === "proximal") {
				// Make the tickFormat return nothing (i.e hide text).
				yxAxis.tickFormat(() => "");
			} else {
				// Make the yxAxis tickFormat match the yzAxis.
				yxAxis.tickFormat(yzAxis.tickFormat());
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
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {string} labelPosition - Position ("proximal" or "distal")
	 */
	attachAccessors(my, state);

	return my;
}
