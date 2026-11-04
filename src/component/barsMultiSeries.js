import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import componentBars from "./bars.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Multi Series Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["orange", "red", "yellow", "steelblue", "green"],
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dBarsMultiSeries";

	/* Components */
	const bars = componentBars();

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

		if (typeof state.xScale === "undefined") {
			state.xScale = d3.scaleBand()
				.domain(columnKeys)
				.range([0, dimensionX])
				.padding(0.5);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY])
				.nice();
		}

		if (typeof state.zScale === "undefined") {
			state.zScale = d3.scaleBand()
				.domain(rowKeys)
				.range([0, dimensionZ])
				.padding(0.7);
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
	 * @alias barsMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true);

			bars.xScale(state.xScale)
				.yScale(state.yScale)
				.dimensions({
					x: state.dimensions.x,
					y: state.dimensions.y,
					z: state.zScale.bandwidth()
				})
				.colors(state.colors);

			const addBars = function() {
				d3.select(this).call(bars);
			};

			const barGroup = element.selectAll(".barGroup")
				.data((d) => d, (d) => d.key);

			barGroup.enter()
				.append("Transform")
				.classed("barGroup", true)
				.merge(barGroup)
				.transition()
				.attr("translation", (d) => {
					const x = 0;
					const y = 0;
					const z = state.zScale(d.key);
					return x + " " + y + " " + z;
				})
				.each(addBars);

			barGroup.exit()
				.remove();
		});
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
	 */
	attachAccessors(my, state);

	return my;
}
