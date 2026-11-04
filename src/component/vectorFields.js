import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { dispatch } from "../events.js";
import { colorParse } from "../colorHelper.js";
import * as glMatrix from "gl-matrix";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Vector Fields Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: d3.schemeRdYlGn[8],
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined,
		sizeScale: undefined,
		sizeRange: [2.0, 5.0]
	};

	state.vectorFunction = function(x, y, z) {
		return {
			vx: x,
			vy: y,
			vz: z
		};
	};
	let classed = "d3X3dVectorFields";

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
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

		const extent = d3.extent(data.values.map((f) => {
			let vx, vy, vz;
			if ("vx" in f) {
				({ vx, vy, vz } = f);
			} else {
				({ vx, vy, vz } = state.vectorFunction(f.x, f.y, f.z, f.value));
			}

			let vector = glMatrix.vec3.fromValues(vx, vy, vz);
			return glMatrix.vec3.length(vector);
		}));

		if (typeof state.xScale === "undefined") {
			state.xScale = d3.scaleLinear()
				.domain([minX, maxX])
				.range([0, dimensionX]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain([minY, maxY])
				.range([0, dimensionY]);
		}

		if (typeof state.zScale === "undefined") {
			state.zScale = d3.scaleLinear()
				.domain([minZ, maxZ])
				.range([0, dimensionZ]);
		}

		if (typeof state.sizeScale === "undefined") {
			state.sizeScale = d3.scaleLinear()
				.domain(extent)
				.range(state.sizeRange);
		}

		if (typeof state.colorScale === "undefined") {
			state.colorScale = d3.scaleQuantize()
				.domain(extent)
				.range(state.colors);
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
						({ vx, vy, vz } = state.vectorFunction(f.x, f.y, f.z, f.value));
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
					f.translation = state.xScale(f.x) + " " + state.yScale(f.y) + " " + state.zScale(f.z);

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
					let offset = state.sizeScale(d.value) / 2;
					return "0 " + offset + " 0";
				})
				.append("Group");

			const arrowHead = arrowsEnter.append("Shape");

			arrowHead.append("Appearance")
				.append("Material")
				.attr("diffuseColor", (d) => colorParse(state.colorScale(d.value)));

			arrowHead.append("Cylinder")
				.attr("height", (d) => state.sizeScale(d.value))
				.attr("radius", 0.1);

			const arrowShaft = arrowsEnter
				.append("Transform")
				.attr("translation", (d) => {
					let offset = state.sizeScale(d.value) / 2;
					return "0 " + offset + " 0";
				})
				.append("Shape");

			arrowShaft.append("Appearance")
				.append("Material")
				.attr("diffuseColor", (d) => colorParse(state.colorScale(d.value)));

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
	 * Dispatch On Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {d3.scale} sizeScale - D3 color scale.
	 * @param {number[]} sizeRange - Size min and max (e.g. [1, 9]).
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {function} vectorFunction - Vector Function.
	 */
	attachAccessors(my, state);

	return my;
}
