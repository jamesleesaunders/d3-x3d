import * as d3 from "d3";
import dataTransform from "../dataTransform";
import { dispatch } from "../events";
import { colorParse } from "../colorHelper";
import * as glMatrix from "gl-matrix";

/**
 * Reusable 3D Vector Fields Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = d3.schemeRdYlGn[8];
	let classed = "d3X3dVectorFields";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeRange = [2.0, 5.0];

	/**
	 * Vector Field Function
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 * @param {number} value
	 * @returns {{vx: number, vy: number, vz: number}}
	 */
	let vectorFunction = function(x, y, z, value = null) {
		return {
			vx: x,
			vy: y,
			vz: z
		};
	};

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { coordinatesMax, coordinatesMin } = dataTransform(data).summary();
		const { x: minX, y: minY, z: minZ } = coordinatesMin;
		const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		const extent = d3.extent(data.values.map((f) => {
			let vx, vy, vz;
			if ("vx" in f) {
				({ vx, vy, vz } = f);
			} else {
				({ vx, vy, vz } = vectorFunction(f.x, f.y, f.z, f.value));
			}

			let vector = glMatrix.vec3.fromValues(vx, vy, vz);
			return glMatrix.vec3.length(vector);
		}));

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain([minX, maxX])
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain([minY, maxY])
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain([minZ, maxZ])
				.range([0, dimensionZ]);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(extent)
				.range(sizeRange);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleQuantize()
				.domain(extent)
				.range(colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias vectorFields
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const vectorData = function(d) {
				return d.values.map((f) => {

					let vx, vy, vz;
					if ("vx" in f) {
						({ vx, vy, vz } = f);
					} else {
						({ vx, vy, vz } = vectorFunction(f.x, f.y, f.z, f.value));
					}

					const vecStart = glMatrix.vec3.fromValues(0, 1, 0);
					const vecEnd = glMatrix.vec3.fromValues(vx, vy, vz);
					const vecLen = glMatrix.vec3.length(vecEnd);

					// rotationTo required unit vectors
					const vecNormal = glMatrix.vec3.create();
					glMatrix.vec3.normalize(vecNormal, vecEnd);

					const quat = glMatrix.quat.create();
					glMatrix.quat.rotationTo(quat, vecStart, vecNormal);
					const vecRotate = glMatrix.vec3.create();
					const angleRotate = glMatrix.quat.getAxisAngle(vecRotate, quat);

					if (!vecLen) {
						// If there is no vector length return null (and filter them out after)
						return null;
					}

					// Calculate transform-translation attr
					f.translation = xScale(f.x) + " " + yScale(f.y) + " " + zScale(f.z);

					// Calculate vector length
					f.value = vecLen;

					// Calculate transform-rotation attr
					f.rotation = [...vecRotate, angleRotate].join(" ");

					return f;
				}).filter(function(f) {
					return f !== null;
				});
			};

			const arrows = element.selectAll(".arrow")
				.data(vectorData);

			const arrowsEnter = arrows.enter()
				.append("Transform")
				.attr("translation", (d) => d.translation)
				.attr("rotation", (d) => d.rotation)
				.attr("class", "arrow")
				.append("Transform")
				.attr("translation", (d) => {
					let offset = sizeScale(d.value) / 2;
					return "0 " + offset + " 0";
				})
				.append("Group");

			const arrowHead = arrowsEnter.append("Shape");

			arrowHead.append("Appearance")
				.append("Material")
				.attr("diffuseColor", (d) => colorParse(colorScale(d.value)));

			arrowHead.append("Cylinder")
				.attr("height", (d) => sizeScale(d.value))
				.attr("radius", 0.1);

			const arrowShaft = arrowsEnter
				.append("Transform")
				.attr("translation", (d) => {
					let offset = sizeScale(d.value) / 2;
					return "0 " + offset + " 0";
				})
				.append("Shape");

			arrowShaft.append("Appearance")
				.append("Material")
				.attr("diffuseColor", (d) => colorParse(colorScale(d.value)));

			arrowShaft
				.append("Cone")
				.attr("height", 1)
				.attr("bottomRadius", 0.4);

			arrowsEnter.merge(arrows);

			arrows.transition()
				.attr("translation", (d) => d.translation);

			arrows.exit()
				.remove();
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
	 * Size Range Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [1, 9]).
	 * @returns {*}
	 */
	my.sizeRange = function(_v) {
		if (!arguments.length) return sizeRange;
		sizeRange = _v;
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

	/**
	 * Vector Function Getter / Setter
	 *
	 * @param {function} _f - Vector Function.
	 * @returns {*}
	 */
	my.vectorFunction = function(_f) {
		if (!arguments.length) return vectorFunction;
		vectorFunction = _f;
		return my;
	};

	/**
	 * Dispatch On Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
