import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Surface Area
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red"];
	let classed = "x3dSurfaceArea";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Array to String
	 *
	 * @private
	 * @param arr
	 * @returns {*}
	 */
	function array2dToString(arr) {
		return arr.reduce(function(a, b) { return a.concat(b); }, [])
			.reduce(function(a, b) { return a.concat(b); }, [])
			.join(' ');
	}

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { rowKeys, columnKeys, maxValue } = dataTransform(data).summary();
		const extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scalePoint().domain(rowKeys).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scalePoint().domain(columnKeys).range([0, dimensions.z]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleLinear().domain(extent).range(colors).interpolate(d3.interpolateLab);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias surfaceArea
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			const ny = data.length;
			const nx = data[0].values.length;

			const coordinatePoints = function(data) {
				const points = data.map(function(X) {
					return X.values.map(function(d) {
						return [xScale(X.key), yScale(d.value), zScale(d.key)];
					})
				});
				return array2dToString(points);
			};

			const colorFaceSet = function(data) {
				const colors = data.map(function(X) {
					return X.values.map(function(d) {
						const col = d3.color(colorScale(d.value));
						return '' + Math.round(col.r / 2.55) / 100 + ' ' + Math.round(col.g / 2.55) / 100 + ' ' + Math.round(col.b / 2.55) / 100;
					})
				});
				return array2dToString(colors);
			};

			const coordIndex = Array.apply(0, Array(ny - 1)).map(function(_, j) {
				return Array.apply(0, Array(nx - 1)).map(function(_, i) {
					const start = i + j * nx;
					return [start, start + nx, start + nx + 1, start + 1, start, -1];
				});
			});

			const coordIndexBack = Array.apply(0, Array(ny - 1)).map(function(_, j) {
				return Array.apply(0, Array(nx - 1)).map(function(_, i) {
					const start = i + j * nx;
					return [start, start + 1, start + nx + 1, start + nx, start, -1];
				});
			});

			const coords = array2dToString(coordIndex.concat(coordIndexBack));

			const surfaces = selection.selectAll(".surface")
				.data([data]);

			const indexedfaceset = surfaces
				.enter()
				.append("shape")
				.append("indexedfaceset")
				.attr("coordIndex", coords);

			indexedfaceset.append("coordinate")
				.attr("point", coordinatePoints);

			indexedfaceset.append("color")
				.attr("color", colorFaceSet);
		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_x) {
		if (!arguments.length) return dimensions;
		dimensions = _x;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.xScale = function(_x) {
		if (!arguments.length) return xScale;
		xScale = _x;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.yScale = function(_x) {
		if (!arguments.length) return yScale;
		yScale = _x;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 scale.
	 * @returns {*}
	 */
	my.zScale = function(_x) {
		if (!arguments.length) return zScale;
		zScale = _x;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 color scale.
	 * @returns {*}
	 */
	my.colorScale = function(_x) {
		if (!arguments.length) return colorScale;
		colorScale = _x;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _x - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_x) {
		if (!arguments.length) return colors;
		colors = _x;
		return my;
	};

	return my;
}
