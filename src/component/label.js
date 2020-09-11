import * as d3 from "d3";
import { colorParse } from "../colorHelper";

/**
 * Reusable 3D Label Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "black";
	let classed = "d3X3dLabel";
	let offset = 0;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;

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
				.attr("translation", (d) => (xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z)))
				.classed("label", true)
				.append("Billboard")
				.attr("axisOfRotation", "0 0 0")
				.append("Transform")
				.attr("translation", (d) => (offset + " " + offset + " " + offset))
				.append("Shape")
				.call(makeSolid, color)
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
				.attr("translation", (d) => (xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z)));
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
	 * Color Getter / Setter
	 *
	 * @param {string} _v - Color (e.g. "red" or "#ff0000").
	 * @returns {*}
	 */
	my.color = function(_v) {
		if (!arguments.length) return color;
		color = _v;
		return my;
	};

	/**
	 * Offset Getter / Setter
	 *
	 * @param {number} _v - Label offset number.
	 * @returns {*}
	 */
	my.offset = function(_v) {
		if (!arguments.length) return offset;
		offset = _v;
		return my;
	};

	return my;
}
