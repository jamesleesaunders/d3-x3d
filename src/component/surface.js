import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { dispatch } from "../events.js";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Surface Area Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: ["blue", "red"],
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dSurface";

	/**
	 * Array to String
	 *
	 * @private
	 * @param {array} arr
	 * @returns {string}
	 */
	const array2dToString = function(arr) {
		return arr.reduce((a, b) => a.concat(b), [])
			.reduce((a, b) => a.concat(b), [])
			.join(" ");
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
				.domain(rowKeys)
				.range([0, dimensionX]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}

		if (typeof state.zScale === "undefined") {
			state.zScale = d3.scalePoint()
				.domain(columnKeys)
				.range([0, dimensionZ]);
		}

		if (typeof state.colorScale === "undefined") {
			state.colorScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(state.colors)
				.interpolate(d3.interpolateLab);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias surface
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true);

			const surfaceData = function(data) {

				const coordPoints = function(Y) {
					return Y.map(function(X) {
						return X.values.map(function(d) {
							return [state.xScale(X.key), state.yScale(d.value), state.zScale(d.key)];
						})
					});
				};

				const coordIndex = function(Y) {
					let ny = Y.length;
					let nx = Y[0].values.length;

					return Array.apply(0, Array(ny - 1)).map(function(_, j) {
						return Array.apply(0, Array(nx - 1)).map(function(_, i) {
							const start = i + j * nx;
							return [start, start + 1, start + nx + 1, start + nx, start, -1];
						});
					});
				};

				const colorFaceSet = function(Y) {
					return Y.map(function(X) {
						return X.values.map(function(d) {
							const color = d3.color(state.colorScale(d.value));
							return colorParse(color);
						})
					});
				};

				data.coordIndex = array2dToString(coordIndex(data));
				data.point = array2dToString(coordPoints(data));
				data.color = array2dToString(colorFaceSet(data));

				return [data];
			};

			const shape = (el) => {
				const shape = el.append("Shape")
					.classed("surface", true);

				const ifs = shape.append("IndexedFaceset")
					.attr("coordIndex", (d) => d.coordIndex)
					.attr("solid", false);

				ifs.append("Coordinate")
					.attr("point", (d) => d.point);

				ifs.append("Color")
					.attr("color", (d) => d.color);

				return shape;
			};

			const surface = element.selectAll(".surface")
				.data((d) => surfaceData(d), (d) => d.key);

			surface.enter()
				.call(shape)
				.merge(surface);

			const surfaceTransition = surface.transition()
				.select("IndexedFaceset")
				.attr("coordIndex", (d) => d.coordIndex);

			surfaceTransition.select("coordinate")
				.attr("point", (d) => d.point);

			surfaceTransition.select("color")
				.attr("color", (d) => d.color);

			surface.exit()
				.remove();
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
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {Array} colors - Array of colours used by color scale.
	 */
	attachAccessors(my, state);

	return my;
}
