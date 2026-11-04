import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Spot Plot
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.spotPlot();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/bubble-chart/
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["green", "red", "yellow", "steelblue", "orange"],
		sizeRange: [0.5, 3.5],
		debug: false,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined,
		sizeScale: undefined
	};
	let classed = "d3X3dSpotPlot";

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.axisThreePlane();
	const spots = component.spotsMultiSeries();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { valueExtent, coordinatesExtent, rowKeys } = dataTransform(data).summary();
		const { x: extentX, y: extentY, z: extentZ } = coordinatesExtent;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

		state.xScale = d3.scaleLinear()
			.domain(extentX)
			.range([0, dimensionX]);

		state.yScale = d3.scaleLinear()
			.domain(extentY)
			.range([0, dimensionY]);

		state.zScale = d3.scaleLinear()
			.domain(extentZ)
			.range([0, dimensionZ]);

		state.colorScale = d3.scaleOrdinal()
			.domain(rowKeys)
			.range(state.colors);

		state.sizeScale = d3.scaleLinear()
			.domain(valueExtent)
			.range(state.sizeRange);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias spotPlot
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "spots"];
		const scene = createScene(selection, layers, classed, state.width, state.height, state.debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale);

			scene.select(".axis")
				.call(axis);

			// Add Spots
			spots.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.sizeScale(state.sizeScale)
				.colorScale(state.colorScale);

			scene.select(".spots")
				.datum(data)
				.call(spots);
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
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {d3.scale} sizeScale - D3 color scale.
	 * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
