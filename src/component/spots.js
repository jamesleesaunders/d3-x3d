import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { dispatch } from "../events.js";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Spot Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: d3.schemeRdYlGn[8],
		color: undefined,
		mappings: undefined,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined,
		sizeScale: undefined,
		sizeRange: [0.5, 3.5],
		plane: "x"
	};
	let classed = "d3X3dSpots";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		let newData = {};
		['x', 'y', 'z', 'size', 'color'].forEach((dimension) => {
			let set = {
				key: dimension,
				values: []
			};

			data.values.forEach((d) => {
				let key = state.mappings[dimension];
				let value = d.values.find((v) => v.key === key).value;
				set.values.push({ key: key, value: value });
			});

			newData[dimension] = dataTransform(set).summary();
		});

		let extentX = newData.x.valueExtent;
		let extentY = newData.y.valueExtent;
		let extentZ = newData.z.valueExtent;
		let extentSize = newData.size.valueExtent;
		let extentColor = newData.color.valueExtent;

		if (typeof state.xScale === "undefined") {
			state.xScale = d3.scaleLinear()
				.domain(extentX)
				.range([0, state.dimensions.x]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(extentY)
				.range([0, state.dimensions.y]);
		}

		if (typeof state.zScale === "undefined") {
			state.zScale = d3.scaleLinear()
				.domain(extentZ)
				.range([0, state.dimensions.z]);
		}

		if (typeof state.sizeScale === "undefined") {
			state.sizeScale = d3.scaleLinear()
				.domain(extentSize)
				.range(state.sizeRange);
		}

		if (state.color) {
			state.colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range([state.color, state.color]);
		} else if (typeof state.colorScale === "undefined") {
			state.colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range(state.colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias spots
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			function getPositionVector(axisDir, d) {
				let xVal = state.xScale(d.values.find((v) => v.key === state.mappings.x).value);
				let yVal = state.yScale(d.values.find((v) => v.key === state.mappings.y).value);
				let zVal = state.zScale(d.values.find((v) => v.key === state.mappings.z).value);

				const positionVectors = {
					x: [0, yVal, zVal],
					y: [xVal, 0, zVal],
					z: [xVal, yVal, 0]
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

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const shape = (el) => {
				const shape = el.append("Shape");

				shape.append("Cylinder")
					.attr("radius", (d) => {
						let sizeVal = d.values.find((v) => v.key === state.mappings.size).value;
						return state.sizeScale(sizeVal);
					})
					.attr("height", 0.1);

				shape.append("Appearance")
					.append("Material")
					.attr("transparency", 0.1)
					.attr("diffuseColor", (d) => {
						let colorVal = d.values.find((v) => v.key === state.mappings.color).value;
						return colorParse(state.colorScale(colorVal));
					});

				return shape;
			};

			const spots = element.selectAll(".spot")
				.data((d) => d.values, (d) => d.key);

			const spotsEnter = spots.enter()
				.append("Transform")
				.attr("class", "spot")
				.call(shape)
				.merge(spots);

			const spotsTransition = spotsEnter.transition();
			spotsTransition
				.attr("translation", (d) => getPositionVector(state.plane, d).join())
				.attr("rotation", (d) => getRotationVector(state.plane).join());

			spotsTransition.select("Shape")
				.select("Cylinder")
				.attr("radius", (d) => {
					let sizeVal = d.values.find((v) => v.key === state.mappings.size).value;
					return state.sizeScale(sizeVal);
				});

			spotsTransition.select("Shape")
				.select("Appearance")
				.select("Material")
				.attr("diffuseColor", (d) => {
					let colorVal = d.values.find((v) => v.key === state.mappings.color).value;
					return colorParse(state.colorScale(colorVal));
				});

			spots.exit()
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
	 * @param {string} plane - Plane of Spots (e.g. "x", "y", "z").
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {d3.scale} sizeScale - D3 size scale.
	 * @param {number[]} sizeRange - Size min and max (e.g. [1, 9]).
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {string} color - Color (e.g. "red" or "#ff0000").
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {Object} mappings - Map properties to size, colour etc.
	 */
	attachAccessors(my, state);

	return my;
}
