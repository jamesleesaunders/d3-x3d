import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { attachEventListners, dispatch } from "../events.js";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 2 },
		colors: ["orange", "red", "yellow", "steelblue", "green"],
		transparency: 0,
		xScale: undefined,
		yScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dBars";

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];
		const { x: dimensionX, y: dimensionY } = state.dimensions;

		if (typeof state.xScale === "undefined") {
			state.xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([0, dimensionX])
				.padding(0.3);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}

		if (typeof state.colorScale === "undefined") {
			state.colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(state.colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bars
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

				shape.append("Box")
					.attr("size", "1.0 1.0 1.0");

				shape.append("Appearance")
					.append("Material")
					.attr("diffuseColor", (d) => {
						// If colour scale is linear then use value for scale.
						let color = state.colorScale(d.key);
						if (typeof state.colorScale.interpolate === "function") {
							color = state.colorScale(d.value);
						}
						return colorParse(color);
					})
					.attr("ambientIntensity", 0.1)
					.attr("transparency", state.transparency);

				return shape;
			};

			const bars = element.selectAll(".bar")
				.data((d) => d.values, (d) => d.key);

			bars.enter()
				.append("Transform")
				.classed("bar", true)
				.call(shape)
				.merge(bars)
				.transition()
				.attr("scale", (d) => {
					let x = state.xScale.bandwidth();
					let y = state.yScale(d.value);
					let z = state.dimensions.z;
					return x + " " + y + " " + z;
				})
				.attr("translation", (d) => {
					let x = state.xScale(d.key);
					let y = state.yScale(d.value) / 2;
					let z = 0.0;
					return x + " " + y + " " + z;
				});

			bars.exit()
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
	 * @param {d3.scale} colorScale - D3 scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {Number} transparency - Transparency level 0 - 1.
	 */
	attachAccessors(my, state);

	return my;
}
