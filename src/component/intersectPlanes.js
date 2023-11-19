import * as d3 from "d3";
import { colorParse } from "../colorHelper.js";

/**
 * Reusable 3D Intersecting Planes Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red", "green"];
	let classed = "d3X3dIntersectPlanes";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias intersectPlanes
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			dimensions.x = xScale ? Math.max(...xScale.range()) : dimensions.x;
			dimensions.y = yScale ? Math.max(...yScale.range()) : dimensions.y;
			dimensions.z = zScale ? Math.max(...zScale.range()) : dimensions.z;

			const xOff = dimensions.x / 2;
			const yOff = dimensions.y / 2;
			const zOff = dimensions.z / 2;
			const xVal = xScale(data.x);
			const yVal = yScale(data.y);
			const zVal = zScale(data.z);

			function getPositionVector(axisDir) {
				const positionVectors = {
					x: [xOff, yOff, zVal],
					y: [xVal, yOff, zOff],
					z: [xOff, yVal, zOff]
				};

				return positionVectors[axisDir];
			}

			function getRotationVector(axisDir) {
				const rotationVectors = {
					x: [1, 1, 0, Math.PI],
					y: [1, 0, 1, Math.PI],
					z: [0, 1, 1, Math.PI]
				};

				return rotationVectors[axisDir];
			}

			const colorScale = d3.scaleOrdinal()
				.domain(Object.keys(dimensions))
				.range(colors);

			// Planes
			const planeSelect = element.selectAll(".plane")
				.data(Object.keys(dimensions));

			const plane = planeSelect.enter()
				.append("Transform")
				.classed("plane", true)
				.attr("translation", (d) => getPositionVector(d).join(" "))
				.attr("rotation", (d) => getRotationVector(d).join(" "))
				.append("Shape");

			plane.append("plane")
				.attr("size", (d) => `${dimensions.x},${dimensions.y}`)
				.attr("solid", false);

			plane.append("Appearance")
				.append("Material")
				.attr("transparency", 0.7)
				.attr("diffuseColor", (d) => colorParse(colorScale(d)));

			plane.merge(planeSelect);

			planeSelect.transition()
				.ease(d3.easeQuadOut)
				.attr("translation", (d) => getPositionVector(d).join(" "));
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

	return my;
}
