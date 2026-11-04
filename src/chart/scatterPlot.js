import * as d3 from "d3";
import { extentsFromMappings } from "../extentsFromMappings.js";
import component from "../component.js";
import { dispatch } from "../events.js";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Scatter Plot Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.scatterPlot();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["orange"],
		color: undefined,
		mappings: undefined,
		debug: false,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined,
		sizeScale: undefined,
		sizeRange: [0.2]
	};
	let classed = "d3X3dScatterPlot";

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.axisThreePlane();
	const crosshair = component.crosshair();
	const label = component.label();
	const bubbles = component.bubbles();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const newData = extentsFromMappings(data, state.mappings, ["x", "y", "z", "size", "color"]);

		let extentX = newData.x.valueExtent;
		let extentY = newData.y.valueExtent;
		let extentZ = newData.z.valueExtent;
		let extentSize = newData.size.valueExtent;
		let extentColor = newData.color.valueExtent;

		state.xScale = d3.scaleLinear()
			.domain(extentX)
			.range([0, state.dimensions.x]);

		state.yScale = d3.scaleLinear()
			.domain(extentY)
			.range([0, state.dimensions.y]);

		state.zScale = d3.scaleLinear()
			.domain(extentZ)
			.range([0, state.dimensions.z]);

		state.sizeScale = d3.scaleLinear()
			.domain(extentSize)
			.range(state.sizeRange);

		if (state.color) {
			state.colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range([state.color, state.color]);
		} else {
			state.colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range(state.colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias scatterPlot
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "bubbles", "crosshair", "label"];
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

			// Add Crosshair
			crosshair.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale);

			// Add Labels
			label.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.offset(0.5);

			// Add Bubbles
			bubbles.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.sizeScale(state.sizeScale)
				.colorScale(state.colorScale)
				.mappings(state.mappings)
				.on("d3X3dClick", function(e) {
					const datum = d3.select(e.target).datum();
					let xVal = datum.values.find((v) => v.key === "x").value;
					let yVal = datum.values.find((v) => v.key === "y").value;
					let zVal = datum.values.find((v) => v.key === "z").value;
					const d = { x: xVal, y: yVal, z: zVal };

					scene.select(".crosshair")
						.datum(d)
						.each(function() {
							d3.select(this).call(crosshair);
						});
				})
				.on("d3X3dMouseOver", function(e) {
					const datum = d3.select(e.target).datum();
					let xVal = datum.values.find((v) => v.key === "x").value;
					let yVal = datum.values.find((v) => v.key === "y").value;
					let zVal = datum.values.find((v) => v.key === "z").value;
					const d = { x: xVal, y: yVal, z: zVal, key: datum.key };

					scene.select(".label")
						.datum(d)
						.each(function() {
							d3.select(this).call(label);
						});
				})
				.on("d3X3dMouseOut", function() {
					scene.select(".label")
						.selectAll("*")
						.remove();
				});

			scene.select(".bubbles")
				.datum(data)
				.call(bubbles);
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
	 * @param {number} width - X3D canvas width in px.
	 * @param {number} height - X3D canvas height in px.
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {d3.scale} sizeScale - D3 color scale.
	 * @param {number[]} sizeRange - Size min and max (e.g. [1, 9]).
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {string} color - Color (e.g. "red" or "#ff0000").
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {Object} mappings - Map properties to size, colour etc.
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
