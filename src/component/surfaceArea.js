import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Surface Area
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red"];
	let classed = "x3dSurfaceArea";

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Array to String
	 *
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
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const dataSummary = dataTransform(data).summary();
		const seriesNames = dataSummary.rowKeys;
		const groupNames = dataSummary.columnKeys;
		const maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range(colors).interpolate(d3.interpolateLab) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scalePoint().domain(seriesNames).range([0, dimensions.x]) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]) :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scalePoint().domain(groupNames).range([0, dimensions.z]) :
			zScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
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
	 * @param {{x: number, y: number, z: number}} _ - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.xScale = function(_) {
		if (!arguments.length) return xScale;
		xScale = _;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.yScale = function(_) {
		if (!arguments.length) return yScale;
		yScale = _;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.zScale = function(_) {
		if (!arguments.length) return zScale;
		zScale = _;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Color Scale.
	 * @returns {*}
	 */
	my.colorScale = function(_) {
		if (!arguments.length) return colorScale;
		colorScale = _;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} _ - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(_) {
		if (!arguments.length) return colors;
		colors = _;
		return my;
	};

	return my;
}
