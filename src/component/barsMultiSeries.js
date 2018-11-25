import * as d3 from "d3";
import dataTransform from "../dataTransform";
import componentBars from "./bars";

/**
 * Reusable 3D Multi Series Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "x3dBarsMultiSeries";

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
	function init(data) {
		const { rowKeys, columnKeys, maxValue } = dataTransform(data).summary();
		const extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.5);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]).nice();
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand().domain(rowKeys).range([0, dimensions.z]).padding(0.7);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barsMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each((data) => {
			init(data);

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

			// Create Bar Groups
			const barGroup = selection.selectAll(".barGroup")
				.data(data);

			barGroup.enter()
				.append("transform")
				.classed("barGroup", true)
				.attr("translation", (d) => {
					let x = 0;
					let y = 0;
					let z = zScale(d.key);
					return x + " " + y + " " + z;
				})
				.append("group")
				.call(bars)
				.merge(barGroup);

			barGroup.exit()
				.remove();

		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.zScale = function(_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _x - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	return my;
}
