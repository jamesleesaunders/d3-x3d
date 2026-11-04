import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import componentArea from "./area.js";
import { attachAccessors } from "../accessors.js";

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
	 * Unique Array
	 *
	 * @param {array} array1
	 * @param {array} array2
	 * @returns {array}
	 */
	const arrayUnique = function(array1, array2) {
		let array = array1.concat(array2);

		let a = array.concat();
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
				if (a[i] === a[j]) {
					a.splice(j--, 1);
				}
			}
		}

		return a;
	};

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
			state.xScale = d3.scalePoint()
				.domain(columnKeys)
				.range([0, dimensionX]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}

		if (typeof state.zScale === "undefined") {
			state.zScale = d3.scaleBand()
				.domain(rowKeys)
				.range([0, dimensionZ])
				.padding(0.4);
		}

		if (typeof state.colorScale === "undefined") {
			colorDomain = arrayUnique(colorDomain, rowKeys);
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

			area.xScale(state.xScale)
				.yScale(state.yScale)
				.dimensions({
					x: state.dimensions.x,
					y: state.dimensions.y,
					z: state.zScale.bandwidth()
				})
				.smoothed(state.smoothed);

			const addArea = function(d) {
				const color = state.colorScale(d.key);
				area.color(color);
				d3.select(this).call(area);
			};

			const areaGroup = element.selectAll(".areaGroup")
				.data((d) => d, (d) => d.key);

			areaGroup.enter()
				.append("Transform")
				.classed("areaGroup", true)
				.merge(areaGroup)
				.transition()
				.attr("translation", (d) => {
					const x = 0;
					const y = 0;
					const z = state.zScale(d.key);
					return x + " " + y + " " + z;
				})
				.each(addArea);

			areaGroup.exit()
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
	 * @param {d3.curve} smoothed
	 */
	attachAccessors(my, state);

	return my;
}
