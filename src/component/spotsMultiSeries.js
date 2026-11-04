import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import componentSpots from "./spots.js";
import { arrayUnique } from "../arrayUnique.js";
import { dispatch } from "../events.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Multi Series Spot Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["green", "red", "yellow", "steelblue", "orange"],
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined,
		sizeScale: undefined,
		sizeRange: [0.5, 3.0]
	};
	let classed = "d3X3dSpotsMultiSeries";

	/* Scales */
	let colorDomain = [];

	/* Components */
	const spots = componentSpots()
		.mappings({ x: 'x', y: 'y', z: 'z', size: 'size', color: 'color' })
		.colors(d3.schemeRdYlGn[8])
		.sizeRange([2, 2]);

	/**
	 * Unique Array
	 *
	 * @param {array} array1
	 * @param {array} array2
	 * @returns {array}
	 */
	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { rowKeys, valueExtent, coordinatesExtent } = dataTransform(data).summary();
		const { x: extentX, y: extentY, z: extentZ } = coordinatesExtent;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = state.dimensions;

		if (typeof state.xScale === "undefined") {
			state.xScale = d3.scaleLinear()
				.domain(extentX)
				.range([0, dimensionX]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(extentY)
				.range([0, dimensionY]);
		}

		if (typeof state.zScale === "undefined") {
			state.zScale = d3.scaleLinear()
				.domain(extentZ)
				.range([0, dimensionZ]);
		}

		colorDomain = arrayUnique(colorDomain, rowKeys);
		state.colorScale = d3.scaleOrdinal()
			.domain(colorDomain)
			.range(state.colors);

		if (typeof state.sizeScale === "undefined") {
			state.sizeScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(state.sizeRange);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias spotsMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const spotData = function(d) {
				return d.map((f) => {
					return {
						key: f.key,
						values: f.values.map((g) => {
							return {
								key: g.key,
								values: [
									{ key: "size", value: g.value },
									{ key: "color", value: g.value },
									{ key: "x", value: g.x },
									{ key: "y", value: g.y },
									{ key: "z", value: g.z }
								]
							}
						})
					};
				});
			};

			spots.xScale(state.xScale)
				.yScale(state.yScale)
				.zScale(state.zScale)
				.sizeScale(state.sizeScale);

			const element = d3.select(this)
				.classed(classed, true);

			const addSpots = function(d) {
				const color = state.colorScale(d.key);
				spots.color(color);
				d3.select(this).call(spots);
			};

			let spotGroup = element.selectAll(".spotGroup")
				.data(['x', 'y', 'z']);

			let spotGroupEnter = spotGroup.enter()
				.append("Group")
				.classed("spotGroup", true)
				.merge(spotGroup);

			spotGroupEnter.each((plane, i, nodes) => {
				spots.plane(plane);

				let el = d3.select(nodes[i]);
				el.classed(plane, true)
				const spotSeries = el.selectAll(".spotSeries")
					.data(spotData(data), (d) => d.key);

				spotSeries.enter()
					.append("Group")
					.classed("spotSeries", true)
					.merge(spotSeries)
					.transition()
					.each(addSpots);

				spotSeries.exit()
					.remove();
			});
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
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 Scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 Scale.
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {d3.scale} sizeScale - D3 size scale.
	 * @param {number[]} sizeRange - Size min and max (e.g. [0.5, 3.0]).
	 * @param {Array} colors - Array of colours used by color scale.
	 */
	attachAccessors(my, state);

	return my;
}
