import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Vertical Bar Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.barChartVertical();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["green", "red", "yellow", "steelblue", "orange"],
		debug: false,
		xScale: undefined,
		yScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dBarChartVertical";

	/* Components */
	const viewpoint = component.viewpoint();
	const xAxis = component.axis();
	const yAxis = component.axis();
	const bars = component.bars();
	const light = component.light();

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

		state.xScale = d3.scaleBand()
			.domain(columnKeys)
			.range([0, dimensionX])
			.padding(0.5)
			.align(0.75);

		state.yScale = d3.scaleLinear()
			.domain(valueExtent)
			.range([0, dimensionY])
			.nice();

		state.colorScale = d3.scaleOrdinal()
			.domain(columnKeys)
			.range(state.colors);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barChartVertical
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["xAxis", "yAxis", "bars"];
		const scene = createScene(selection, layers, classed, state.width, state.height, state.debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.quickView("left");

			scene.call(viewpoint);

			// Add Axis
			xAxis.scale(state.xScale)
				.direction("x")
				.tickDirection("y")
				.tickSize(0);

			yAxis.scale(state.yScale)
				.direction("y")
				.tickDirection("x")
				.tickSize(state.yScale.range()[1] - state.yScale.range()[0]);

			scene.select(".xAxis")
				.call(xAxis);

			scene.select(".yAxis")
				.call(yAxis);

			// Add Bars
			bars.xScale(state.xScale)
				.yScale(state.yScale)
				.colors(state.colors);

			scene.select(".bars")
				.datum(data)
				.call(bars);

			// Add Light
			scene.call(light);
		});
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {number} width - X3D canvas width in px.
	 * @param {number} height - X3D canvas height in px.
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
