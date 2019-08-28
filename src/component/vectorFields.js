import * as d3 from "d3";
import dataTransform from "../dataTransform";
import { dispatch } from "../events";
import { colorParse } from "../colorHelper";
// import * as x3dom from "x3dom";
import { Quaternion, Vector3, Matrix3 } from 'math.gl';

/**
 * Reusable 3D Vector Fields Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = d3.interpolateRdYlGn;
	let classed = "d3X3dVectorFields";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeDomain = [2.0, 5.0];

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
			if ('vx' in f) {
				({ vx, vy, vz } = f);
			} else {
				({ vx, vy, vz } = vectorFunction(f.x, f.y, f.z, f.value));
			}

			return new x3dom.fields.SFVec3f(vx, vy, vz).length();
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

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleSequential()
				.domain(extent.slice().reverse())
				.interpolator(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(extent)
				.range(sizeDomain);
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
					if ('vx' in f) {
						({ vx, vy, vz } = f);
					} else {
						({ vx, vy, vz } = vectorFunction(f.x, f.y, f.z, f.value));
					}

					let fromVector = new x3dom.fields.SFVec3f(0, 1, 0);
					let toVector = new x3dom.fields.SFVec3f(vx, vy, vz);
					let qDir = x3dom.fields.Quaternion.rotateFromTo(fromVector, toVector);
					let rot = qDir.toAxisAngle();
					console.log(rot);

					let fromVector2 = new Vector3(0, 1, 0);
					let toVector2 = new Vector3(vx, vy, vz);
					let foo = fromVector2.cross(toVector2);
					// let qDir2 = new Quaternion().rotationTo(toVector2, fromVector2);
					let qDir2 = new Quaternion(vx, vy, vz).fromMatrix3(new Matrix3([0,1,0]));
					console.log(qDir2);

					/*
					const jim1 = new Vector3(vx, vy, vz).angle(new Matrix3([0, 1, 0]));
					console.log(jim1);
					 */

					let rot2 = [{x: qDir2.x, y: qDir2.y, z: qDir2.z}, qDir2.w];
					console.log(rot2);

					if (!toVector.length()) {
						// If there is no vector length return null (and filter them out after)
						return null;
					}

					// Calculate transform-translation attr
					f.translation = xScale(f.x) + " " + yScale(f.y) + " " + zScale(f.z);

					// Calculate vector length
					f.value = toVector.length();

					// Calculate transform-rotation attr
					//f.rotation = rot[0].x + " " + rot[0].y + " " + rot[0].z + " " + rot[1];
					f.rotation = qDir2.x + " " + qDir2.y + " " + qDir2.z + " " + qDir2.w;

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
				.append("cone")
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
