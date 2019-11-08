import * as d3 from "d3";
import dataTransform from "../dataTransform";
import componentBubbles from "./bubbles";
import { dispatch } from "../events";

/**
 * Reusable 3D Multi Series Bubble Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["green", "red", "yellow", "steelblue", "orange"];
	let classed = "d3X3dBubblesMultiSeries";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let colorDomain = [];
	let sizeScale;
	let sizeRange = [0.5, 3.0];

	/* Components */
	const bubbles = componentBubbles();

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

	 /**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { rowKeys, valueExtent, coordinatesExtent } = dataTransform(data).summary();
		const { x: extentX, y: extentY, z: extentZ } = coordinatesExtent;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		xScale = d3.scaleLinear()
			.domain(extentX)
			.range([0, dimensionX]);

		yScale = d3.scaleLinear()
			.domain(extentY)
			.range([0, dimensionY]);

		zScale = d3.scaleLinear()
			.domain(extentZ)
			.range([0, dimensionZ]);

		colorDomain = arrayUnique(colorDomain, rowKeys);
		colorScale = d3.scaleOrdinal()
			.domain(colorDomain)
			.range(colors);

		sizeScale = d3.scaleLinear()
			.domain(valueExtent)
			.range(sizeRange);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bubblesMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true);

			bubbles.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.sizeScale(sizeScale);

			const addBubbles = function(d) {
				const color = colorScale(d.key);
				bubbles.color(color);
				d3.select(this).call(bubbles);
			};

			const bubbleGroup = element.selectAll(".bubbleGroup")
				.data((d) => d, (d) => d.key);

			bubbleGroup.enter()
				.append("Group")
				.classed("bubbleGroup", true)
				.merge(bubbleGroup)
				.transition()
				.each(addBubbles);

			bubbleGroup.exit()
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
	 * @param {d3.scale} _v - D3 Scale.
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
	 * @param {d3.scale} _v - D3 Scale.
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
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 size scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Size Range Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [0.5, 3.0]).
	 * @returns {*}
	 */
	my.sizeRange = function(_v) {
		if (!arguments.length) return sizeRange;
		sizeRange = _v;
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

	/**
	 * Dispatch On Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
