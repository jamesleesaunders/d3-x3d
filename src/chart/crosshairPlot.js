import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Crosshair Plot (Experimental) Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.crosshairPlot();
 *
 * chartHolder.datum(myData).call(myChart);
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		debug: false,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined
	};
	let classed = "d3X3dCrosshairPlot";

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.axisThreePlane();
	const crosshair = component.crosshair();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { coordinatesMax } = dataTransform(data).summary();
		const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

		state.xScale = d3.scaleLinear()
			.domain([0, maxX])
			.range([0, dimensionX]);

		state.yScale = d3.scaleLinear()
			.domain([0, maxY])
			.range([0, dimensionY]);

		state.zScale = d3.scaleLinear()
			.domain([0, maxZ])
			.range([0, dimensionZ]);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias crosshairPlot
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "crosshairs"];
		const scene = createScene(selection, layers, classed, state.width, state.height, state.debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.centerOfRotation([state.dimensions.x / 2, state.dimensions.y / 2, state.dimensions.z / 2]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.dimensions(state.dimensions);

			scene.select(".axis")
				.call(axis);

			// Add Crosshair
			crosshair.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale);

			let crosshairs = scene.select(".crosshairs")
				.datum(data)
				.selectAll(".crosshair")
				.data((d) => d.values);

			crosshairs.enter()
				.append("group")
				.classed("crosshair", true)
				.merge(crosshairs)
				.transition()
				.each(function() {
					d3.select(this).call(crosshair);
				});
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
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
