import * as d3 from "d3";
import componentArea from "./area.js";
import { arrayUnique } from "../arrayUnique.js";
import { attachAccessors } from "../accessors.js";
import { assignSeriesScales, drawSeriesGroups } from "./seriesGroup.js";

/**
 * Reusable 3D Multi Series Area Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["orange", "red", "yellow", "steelblue", "green"],
		smoothed: d3.curveMonotoneX,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dAreaMultiSeries";

	/* Scales */
	let colorDomain = [];

	/* Components */
	const area = componentArea();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const summary = assignSeriesScales(state, data, {
			xScale: (seriesSummary, dimensions) => d3.scalePoint()
				.domain(seriesSummary.columnKeys)
				.range([0, dimensions.x]),
			yScale: (seriesSummary, dimensions) => d3.scaleLinear()
				.domain([0, seriesSummary.valueMax])
				.range([0, dimensions.y]),
			zScale: (seriesSummary, dimensions) => d3.scaleBand()
				.domain(seriesSummary.rowKeys)
				.range([0, dimensions.z])
				.padding(0.4)
		});

		if (typeof state.colorScale === "undefined") {
			colorDomain = arrayUnique(colorDomain, summary.rowKeys);
			state.colorScale = d3.scaleOrdinal()
				.domain(colorDomain)
				.range(state.colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias areaMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true);

			drawSeriesGroups(element, state, {
				groupClass: "areaGroup",
				mark: area,
				configure: (mark) => mark.smoothed(state.smoothed),
				colorBySeries: true
			});
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
	 * @param {d3.curve} smoothed
	 */
	attachAccessors(my, state);

	return my;
}
