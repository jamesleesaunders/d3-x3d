import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";
import { default as component } from "../component";

/**
 * Reusable 3D Bubble Chart
 *
 * @module
 * @see https://datavizproject.com/data-type/bubble-chart/
 */
export default function() {

	/**
	 * Default Properties
	 */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["green", "red", "yellow", "steelblue", "orange"];
	let classed = "x3dBubbleChart";
	let debug = false;

	/**
	 * Scales
	 */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeDomain = [0.5, 4.0];

	/**
	 * Initialise Data and Scales
	 *
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const dataSummary = dataTransform(data).summary();
		const seriesNames = dataSummary.rowKeys;
		const maxCoordinates = dataSummary.maxCoordinates;
		const maxValue = dataSummary.maxValue;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]) :
			yScale;

		zScale = (typeof zScale === "undefined") ?
			d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]) :
			zScale;

		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(seriesNames).range(colors) :
			colorScale;

		sizeScale = (typeof sizeScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range(sizeDomain) :
			sizeScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
	 */
	function my(selection) {
		let x3d = selection.append("x3d")
			.attr("width", width + "px")
			.attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true")
		}

		let scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		let layers = ["axis", "chart"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		let viewpoint = component.viewpoint()
			.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.append("directionallight")
			.attr("direction", "1 0 -1")
			.attr("on", "true")
			.attr("intensity", "0.4")
			.attr("shadowintensity", "0");

		scene.each(function(data) {
			init(data);

			// Construct Axis Component
			let axis = component.axisThreePlane()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Bubbles Component
			let chart = component.bubblesMultiSeries()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.sizeScale(sizeScale)
				.colorScale(colorScale);

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
	 * @param {number} _ - X3D Canvas Height in px.
	 * @returns {*}
	 */
	my.width = function(_) {
		if (!arguments.length) return width;
		width = _;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _ - X3D Canvas Height in px.
	 * @returns {*}
	 */
	my.height = function(_) {
		if (!arguments.length) return height;
		height = _;
		return this;
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} _ - 3D Object dimensions.
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
	 * @param {Object} _ - D3 Scale.
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

	/**
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Color Scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_) {
		if (!arguments.length) return sizeScale;
		sizeScale = _;
		return my;
	};

	/**
	 * Size Domain Getter / Setter
	 *
	 * @param {[{number}, {number}]} _ - Size min and max.
	 * @returns {*}
	 */
	my.sizeDomain = function(_) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _;
		return my;
	};

	/**
	 * Debug Getter / Setter
	 *
	 * @param {Boolean} _ - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function(_) {
		if (!arguments.length) return debug;
		debug = _;
		return my;
	};

	return my;
}
