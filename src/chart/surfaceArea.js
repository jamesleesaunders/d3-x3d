import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Surface Area
 * @see https://datavizproject.com/data-type/three-dimensional-stream-graph/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["blue", "red"];
	let classed = "x3dSurfaceArea";
	let debug = false;

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 */
	function init(data) {
		const dataSummary = dataTransform(data).summary();
		const seriesNames = dataSummary.rowKeys;
		const groupNames = dataSummary.columnKeys;
		const maxValue = dataSummary.maxValue;

		const extent = [0, maxValue];

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleLinear().domain(extent).range(colors).interpolate(d3.interpolateLab) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scalePoint().domain(seriesNames).range([0, dimensions.x]) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain(extent).range([0, dimensions.y]).nice() :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scalePoint().domain(groupNames).range([0, dimensions.z]) :
			zScale;
	}

	/**
	 * Constructor
	 */
	function my(selection) {
		const x3d = selection.append("x3d")
			.attr("width", width + "px")
			.attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true")
		}

		const scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		const layers = ["axis", "chart"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		const viewpoint = component.viewpoint()
			.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.each(function(data) {
			init(data);

			// Construct Axis Component
			const axis = component.axisThreePlane()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Surface Area Component
			const chart = component.surfaceArea()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colors(colors);

			scene.select(".axis")
				.call(axis);

			scene.select(".chart")
				.datum(data)
				.call(chart);
		});
	}

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} value - X3D Canvas Height in px.
	 * @returns {*}
	 */
	my.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} value - X3D Canvas Height in px.
	 * @returns {*}
	 */
	my.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return this;
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} value - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(value) {
		if (!arguments.length) return dimensions;
		dimensions = value;
		return this;
	};

	/**
	 * X Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.xScale = function(value) {
		if (!arguments.length) return xScale;
		xScale = value;
		return my;
	};

	/**
	 * Y Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.yScale = function(value) {
		if (!arguments.length) return yScale;
		yScale = value;
		return my;
	};

	/**
	 * Z Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.zScale = function(value) {
		if (!arguments.length) return zScale;
		zScale = value;
		return my;
	};

	/**
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Color Scale.
	 * @returns {*}
	 */
	my.colorScale = function(value) {
		if (!arguments.length) return colorScale;
		colorScale = value;
		return my;
	};

	/**
	 * Colors Getter / Setter
	 *
	 * @param {Array} value - Array of colours used by color scale.
	 * @returns {*}
	 */
	my.colors = function(value) {
		if (!arguments.length) return colors;
		colors = value;
		return my;
	};

	/**
	 * Debug Getter / Setter
	 *
	 * @param {boolean} value - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function(value) {
		if (!arguments.length) return debug;
		debug = value;
		return my;
	};

	return my;
}
