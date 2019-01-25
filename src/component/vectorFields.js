import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Vector Fields Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "teal";
	let classed = "x3dVectorFields";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let sizeScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { valueExtent, coordinatesMax } = dataTransform(data).summary();
		const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain([0, maxX])
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain([0, maxY])
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain([0, maxZ])
				.range([0, dimensionZ]);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias vectorFields
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each((data) => {
			init(data);

			const vectorData = function(d) {
				return d.values.map((field) => {
					let point1 = [0, 1, 0];
					let point2 = [field.vx, field.vy, field.vz];
					let vector1 = new x3dom.fields.SFVec3f(...point1);
					let vector2 = new x3dom.fields.SFVec3f(...point2);
					let qDir = x3dom.fields.Quaternion.rotateFromTo(vector1, vector2);
					let rot = qDir.toAxisAngle();
					let len = vector2.length();

					// Calculate transform-translation attr
					field.translation = xScale(field.x) + " " + yScale(field.y) + " " + zScale(field.z);

					// Calculate vector length
					field.length = len;

					// Calculate transform-center attr
					field.offset = "0 " + (len / 2) + " 0";

					// Calculate transform-rotation attr
					field.rotation = rot[0].x + " " + rot[0].y + " " + rot[0].z + " " + rot[1];

					return field;
				});
			};

			const arrows = selection.selectAll(".arrow")
				.data(vectorData);

			const arrowsEnter = arrows.enter()
				.append("transform")
				.attr("class", "arrow")
				.attr("translation", (d) => d.translation)
				.attr("rotation", (d) => d.rotation)
				.append("transform")
				.attr("translation", (d) => d.offset);

			let shape = arrowsEnter.append("shape");

			shape.append("appearance")
				.append("material")
				.attr("diffusecolor", color);

			shape.append("cone")
				.attr("height", (d) => d.length)
				.attr("bottomradius", "0.4");

			arrowsEnter.merge(arrows);

			arrows.transition()
				.attr("translation", (d) => d.translation);

			arrows.exit()
				.remove();
		});
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
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Size Domain Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [1, 9]).
	 * @returns {*}
	 */
	my.sizeDomain = function(_v) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _v;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _v - Color (e.g. 'red' or '#ff0000').
	 * @returns {*}
	 */
	my.color = function(_v) {
		if (!arguments.length) return color;
		color = _v;
		return my;
	};

	return my;
}
