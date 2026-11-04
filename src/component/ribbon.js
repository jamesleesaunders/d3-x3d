import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { dispatch } from "../events.js";
import { attachAccessors } from "../accessors.js";
import { drawIndexedFaceStrip } from "./indexedFaceStrip.js";

/**
 * Reusable 3D Ribbon Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 5 },
		color: "red",
		smoothed: d3.curveBasis,
		xScale: undefined,
		yScale: undefined
	};
	let transparency = 0.1;
	let classed = "d3X3dRibbon";

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
			state.xScale = d3.scalePoint()
				.domain(columnKeys)
				.range([0, dimensionX]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias ribbon
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			drawIndexedFaceStrip(element, state, {
				itemClass: "ribbon",
				transparency: transparency,
				quad: (pointThis, pointNext) => {
					const x1 = state.xScale(pointThis.key);
					const x2 = state.xScale(pointNext.key);
					const y1 = state.yScale(pointThis.value);
					const y2 = state.yScale(pointNext.value);
					const z1 = 1 - (state.dimensions.z) / 2;
					const z2 = (state.dimensions.z) / 2;

					return [x1, y1, z1, x1, y1, z2, x2, y2, z2, x2, y2, z1];
				}
			});

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
	 * @param {{x: {number}, y: {number}, z: {number}}} dimensions - 3D Object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {string} color - Color (e.g. "red" or "#ff0000").
	 * @param {d3.curve} smoothed
	 */
	attachAccessors(my, state);

	return my;
}
