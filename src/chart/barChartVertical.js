import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Bar Chart
 *
 * @module
 * @see https://datavizproject.com/data-type/3d-bar-chart/
 */
export default function() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["green", "red", "yellow", "steelblue", "orange"];
	let classed = "x3dBarChartVertical";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let colorScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const dataSummary = dataTransform(data).summary();
		const categoryNames = dataSummary.columnKeys;
		const maxValue = dataSummary.maxValue;

		// If the colorScale has not been passed then attempt to calculate.
		colorScale = (typeof colorScale === "undefined") ?
			d3.scaleOrdinal().domain(categoryNames).range(colors) :
			colorScale;

		// Calculate Scales.
		xScale = (typeof xScale === "undefined") ?
			d3.scaleBand().domain(categoryNames).rangeRound([0, dimensions.x]).padding(0.5) :
			xScale;

		yScale = (typeof yScale === "undefined") ?
			d3.scaleLinear().domain([0, maxValue]).range([0, dimensions.y]).nice() :
			yScale;
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias barChartVertical
	 * @param {d3.selection} selection - The chart holder D3 selection.
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
		const layers = ["xAxis", "yAxis", "chart"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", function(d) { return d; });

		const viewpoint = component.viewpoint()
			.quickView("left");
		scene.call(viewpoint);

		scene.each(function(data) {
			init(data);

			// Construct Axis Components
			const xAxis = component.axis()
				.scale(xScale)
				.dir('x')
				.tickDir('y');

			const yAxis = component.axis()
				.scale(yScale)
				.dir('y')
				.tickDir('x')
				.tickSize(yScale.range()[1] - yScale.range()[0]);

			// Construct Bars Component
			const chart = component.bars()
				.xScale(xScale)
				.yScale(yScale)
				.colors(colors);

			scene.select(".xAxis")
				.call(xAxis);

			scene.select(".yAxis")
				.call(yAxis);

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
