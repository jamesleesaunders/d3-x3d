import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import componentRibbon from "./ribbon.js";
import { arrayUnique } from "../arrayUnique.js";
import { dispatch } from "../events.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Multi Series Ribbon Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["orange", "red", "yellow", "steelblue", "green"],
		smoothed: d3.curveBasis,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dRibbonMultiSeries";

	/* Scales */
	let colorDomain = [];

	/* Components */
	const ribbon = componentRibbon();

	/**
	 * Unique Array
	 *
	 * @param {array} array1
	 * @param {array} array2
	 * @returns {array}
	 */
	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

		state.xScale = d3.scalePoint()
			.domain(columnKeys)
			.range([0, dimensionX]);

		state.yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([0, dimensionY]);

		state.zScale = d3.scaleBand()
			.domain(rowKeys)
			.range([0, dimensionZ])
			.padding(0.4);

		colorDomain = arrayUnique(colorDomain, rowKeys);
		state.colorScale = d3.scaleOrdinal()
			.domain(colorDomain)
			.range(state.colors);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias ribbonMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true);

			ribbon.xScale(state.xScale)
				.yScale(state.yScale)
				.dimensions({
					x: state.dimensions.x,
					y: state.dimensions.y,
					z: state.zScale.bandwidth()
				})
				.smoothed(state.smoothed);

			const addRibbon = function(d) {
				const color = state.colorScale(d.key);
				ribbon.color(color);
				d3.select(this).call(ribbon);
			};

			const ribbonGroup = element.selectAll(".ribbonGroup")
				.data((d) => d, (d) => d.key);

			ribbonGroup.enter()
				.append("Transform")
				.classed("ribbonGroup", true)
				.merge(ribbonGroup)
				.transition()
				.attr("translation", (d) => {
					const x = 0;
					const y = 0;
					const z = state.zScale(d.key);
					return x + " " + y + " " + z;
				})
				.each(addRibbon);

			ribbonGroup.exit()
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
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {d3.curve} smoothed
	 */
	attachAccessors(my, state);

	return my;
}
