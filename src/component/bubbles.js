import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { dispatch, attachEventListners } from "../events.js";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Bubble Chart Component
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
		sizeRange: [0.2, 4.0]
	};
	let classed = "d3X3dBubbles";

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
	 * @alias bubbles
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const shape = (el) => {
				const shape = el.append("Shape");

				attachEventListners(shape);

				shape.append("Sphere")
					.attr("radius", (d) => {
						let sizeVal = d.values.find((v) => v.key === state.mappings.size).value;
						return state.sizeScale(sizeVal);
					});

				shape.append("Appearance")
					.append("Material")
					.attr("diffuseColor", (d) => {
						let colorVal = d.values.find((v) => v.key === state.mappings.color).value;
						return colorParse(state.colorScale(colorVal));
					})
					.attr("ambientIntensity", 0.1);

				return shape;
			};

			const bubbles = element.selectAll(".bubble")
				.data((d) => d.values, (d) => d.key);

			const bubblesEnter = bubbles.enter()
				.append("Transform")
				.attr("class", "bubble")
				.call(shape)
				.merge(bubbles);

			const bubblesTransition = bubblesEnter.transition();
			bubblesTransition.attr("translation", (d) => {
				let xVal = d.values.find((v) => v.key === state.mappings.x).value;
				let yVal = d.values.find((v) => v.key === state.mappings.y).value;
				let zVal = d.values.find((v) => v.key === state.mappings.z).value;
				return state.xScale(xVal) + " " + state.yScale(yVal) + " " + state.zScale(zVal);
			});

			bubblesTransition.select("Shape")
				.select("Sphere")
				.attr("radius", (d) => {
					let sizeVal = d.values.find((v) => v.key === state.mappings.size).value;
					return state.sizeScale(sizeVal);
				});

			bubblesTransition.select("Shape")
				.select("Appearance")
				.select("Material")
				.attr("diffuseColor", (d) => {
					let colorVal = d.values.find((v) => v.key === state.mappings.color).value;
					return colorParse(state.colorScale(colorVal));
				});

			bubbles.exit()
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
