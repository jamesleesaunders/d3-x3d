import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import * as glMatrix from "gl-matrix";
import { createScene } from "../base.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Vector Field Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let vectorFunction = (x, y, z, value) => {
 *    return {
 *       vx: Math.pow(x, 2) + y * Math.pow(x, 2),
 *       vy: Math.pow(y, 2) - x * Math.pow(z, 2),
 *       vz: Math.pow(z, 2)
 *    };
 * };
 *
 * let myChart = d3.x3d.chart.vectorFieldChart()
 *    .vectorFunction(vectorFunction);
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://mathinsight.org/vector_field_overview
 */
export default function() {

	/* Default Properties */
	const state = {
		width: 500,
		height: 500,
		dimensions: { x: 40, y: 40, z: 40 },
		colors: d3.schemeRdYlGn[8],
		debug: false,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined,
		sizeScale: undefined,
		sizeRange: [2.0, 5.0]
	};

	state.vectorFunction = function(x, y, z, value = null) {
		return {
			vx: x,
			vy: y,
			vz: z
		};
	};
	let classed = "d3X3dVectorFieldChart";

	/* Scales */
	let origin = { x: 0, y: 0, z: 0 };

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.crosshair();
	const vectorFields = component.vectorFields();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { coordinatesMax, coordinatesMin } = dataTransform(data).summary();
		const { x: minX, y: minY, z: minZ } = coordinatesMin;
		const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

		const extent = d3.extent(data.values.map((f) => {
			let vx, vy, vz;
			if ("vx" in f) {
				({ vx, vy, vz } = f);
			} else {
				({ vx, vy, vz } = state.vectorFunction(f.x, f.y, f.z, f.value));
			}

			let vector = glMatrix.vec3.fromValues(vx, vy, vz);
			return glMatrix.vec3.length(vector);
		}));

		state.xScale = d3.scaleLinear()
			.domain([minX, maxX])
			.range([0, dimensionX]);

		state.yScale = d3.scaleLinear()
			.domain([minY, maxY])
			.range([0, dimensionY]);

		state.zScale = d3.scaleLinear()
			.domain([minZ, maxZ])
			.range([0, dimensionZ]);

		state.sizeScale = d3.scaleLinear()
			.domain(extent)
			.range(state.sizeRange);

		state.colorScale = d3.scaleQuantize()
			.domain(extent)
			.range(state.colors);

		// TODO: Have a think about whether this is appropriate?
		// Or, do we always want the origin to be 0,0,0 ?
		origin = {
			x: (minX < 0) ? 0 : minX,
			y: (minY < 0) ? 0 : minY,
			z: (minZ < 0) ? 0 : minZ
		};
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias vectorFieldChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "vectorFields"];
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
				.datum(origin)
				.call(axis);

			// Add Vector Fields
			vectorFields.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.colorScale(state.colorScale)
				.sizeScale(state.sizeScale)
				.vectorFunction(state.vectorFunction);

			scene.select(".vectorFields")
				.datum(data)
				.call(vectorFields);
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
	 * @param {function} vectorFunction - Vector Function.
	 * @param {boolean} debug - Show debug log and stats. True/False.
	 */
	attachAccessors(my, state);

	return my;
}
