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
	 * @param {number} _x - X3D canvas width in px.
	 * @returns {*}
	 */
	my.width = function(_x) {
		if (!arguments.length) return width;
		width = _x;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _x - X3D canvas height in px.
	 * @returns {*}
	 */
	my.height = function(_x) {
		if (!arguments.length) return height;
		height = _x;
		return this;
	};

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

	/**
	 * Debug Getter / Setter
	 *
	 * @param {boolean} _x - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function(_x) {
		if (!arguments.length) return debug;
		debug = _x;
		return my;
	};

	return my;
}
