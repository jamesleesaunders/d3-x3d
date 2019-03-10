import * as d3 from "d3";
import dataTransform from "../dataTransform";
import { dispatch } from "../events";

/**
 * Reusable 3D Surface Area Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red"];
	let classed = "d3X3domSurface";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

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
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		if (typeof xScale === "undefined") {
			xScale = d3.scalePoint()
				.domain(rowKeys)
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scalePoint()
				.domain(columnKeys)
				.range([0, dimensionZ]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(colors)
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

			const surfaceData = function(d) {

				const coordPoints = function(data) {
					return data.map(function(X) {
						return X.values.map(function(d) {
							return [xScale(X.key), yScale(d.value), zScale(d.key)];
						})
					});
				};

				const coordIndex = function(data) {
					let ny = data.length;
					let nx = data[0].values.length;

					let coordIndexFront = Array.apply(0, Array(ny - 1)).map(function(_, j) {
						return Array.apply(0, Array(nx - 1)).map(function(_, i) {
							const start = i + j * nx;
							return [start, start + nx, start + nx + 1, start + 1, start, -1];
						});
					});

					let coordIndexBack = Array.apply(0, Array(ny - 1)).map(function(_, j) {
						return Array.apply(0, Array(nx - 1)).map(function(_, i) {
							const start = i + j * nx;
							return [start, start + 1, start + nx + 1, start + nx, start, -1];
						});
					});

					return coordIndexFront.concat(coordIndexBack);
				};

				const colorFaceSet = function(data) {
					return data.map(function(X) {
						return X.values.map(function(d) {
							const col = d3.color(colorScale(d.value));
							return '' + Math.round(col.r / 2.55) / 100 + ' ' + Math.round(col.g / 2.55) / 100 + ' ' + Math.round(col.b / 2.55) / 100;
						})
					});
				};

				return [{
					coordindex: array2dToString(coordIndex(d)),
					point: array2dToString(coordPoints(d)),
					color: array2dToString(colorFaceSet(d))
				}];
			};

			const surface = element.selectAll(".surface")
				.data(surfaceData);

			const surfaceSelect = surface
				.enter()
				.append("shape")
				.classed("surface", true)
				.append("indexedfaceset")
				.attr("coordindex", (d) => d.coordindex);

			surfaceSelect.append("coordinate")
				.attr("point", (d) => d.point);

			surfaceSelect.append("color")
				.attr("color", (d) => d.color);

			surfaceSelect.merge(surface);

			const surfaceTransition = surface.transition()
				.select("indexedfaceset")
				.attr("coordindex", (d) => d.coordindex);

			surfaceTransition.select("coordinate")
				.attr("point", (d) => d.point);

			surfaceTransition.select("color")
				.attr("color", (d) => d.color);

			surface.exit()
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
	 * @param {d3.scale} _v - D3 scale.
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
	 * @param {d3.scale} _v - D3 scale.
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
