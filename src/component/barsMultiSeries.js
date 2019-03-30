import * as d3 from "d3";
import dataTransform from "../dataTransform";
import componentBars from "./bars";
import componentBubbles from "./bubbles";

/**
 * Reusable 3D Multi Series Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "d3X3domBarsMultiSeries";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		xScale = d3.scaleBand()
			.domain(columnKeys)
			.rangeRound([0, dimensionX])
			.padding(0.5);

		yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([0, dimensionY])
			.nice();

		zScale = d3.scaleBand()
			.domain(rowKeys)
			.range([0, dimensionZ])
			.padding(0.7);

		colorScale = d3.scaleOrdinal()
			.domain(columnKeys)
			.range(colors);
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

			const addBars = function(d) {
				// Construct Bars Component
				const bars = componentBars()
					.xScale(xScale)
					.yScale(yScale)
					.dimensions({
						x: dimensions.x,
						y: dimensions.y,
						z: zScale.bandwidth()
					})
					.colors(colors);

				d3.select(this).call(bars);
			};

			// Create Bar Groups
			const barGroup = element.selectAll(".barGroup")
				.data((d) => d, (d) => d.key);

			barGroup.enter()
				.append("transform")
				.classed("barGroup", true)
				.attr("id", (d) => d.key)
				.merge(barGroup)
				.transition()
				.attr("translation", (d) => {
					const x = 0;
					const y = 0;
					const z = zScale(d.key);
					return x + " " + y + " " + z;
				})
				.each(addBars);

			barGroup.exit()
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

	return my;
}
