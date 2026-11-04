import component from "../component.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Donut Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.donutChart();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/donut-chart/
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["green", "red", "yellow", "steelblue", "orange"],
		debug: false
	};
	let classed = "d3X3dDonutChart";

	/* Components */
	const viewpoint = component.viewpoint();
	const donut = component.donut();
	const light = component.light();

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias donutChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["donut"];
		const scene = createScene(selection, layers, classed, state.width, state.height, state.debug);

		selection.each((data) => {
			// Add Viewpoint
			viewpoint.quickView("dimetric");

			// Add Donut
			donut.colors(state.colors);

			scene.call(viewpoint);
			scene.select(".donut")
				.datum(data)
				.call(donut);

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
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
