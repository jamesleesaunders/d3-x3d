import * as d3 from "d3";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Label Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		color: "black",
		offset: 0,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined
	};
	let classed = "d3X3dLabel";

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias label
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const makeSolid = (el, color) => {
				el.append("Appearance")
					.append("Material")
					.attr("diffuseColor", colorParse(color) || "0 0 0");
			};

			const labelSelect = element.selectAll(".label")
				.data([data]);

			let label = labelSelect.enter()
				.append("Transform")
				.attr("translation", (d) => (state.xScale(d.x) + " " + state.yScale(d.y) + " " + state.zScale(d.z)))
				.classed("label", true)
				.append("Billboard")
				.attr("axisOfRotation", "0 0 0")
				.append("Transform")
				.attr("translation", (d) => (state.offset + " " + state.offset + " " + state.offset))
				.append("Shape")
				.call(makeSolid, state.color)
				.append("Text")
				.attr("string", (d) => d.key)
				.append("FontStyle")
				.attr("size", 1)
				.attr("family", "SANS")
				.attr("style", "BOLD")
				.attr("justify", "START");

			label.merge(labelSelect);

			labelSelect.transition()
				.ease(d3.easeQuadOut)
				.attr("translation", (d) => (state.xScale(d.x) + " " + state.yScale(d.y) + " " + state.zScale(d.z)));
		});
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {string} color - Color (e.g. "red" or "#ff0000").
	 * @param {number} offset - Label offset number.
	 */
	attachAccessors(my, state);

	return my;
}
