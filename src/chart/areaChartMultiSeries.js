import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Multi Series Area Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3dom.chart.areaChartMultiSeries();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/waterfall-plot/
 */
export default function() {

	var x3d = void 0;
	var scene = void 0;

	/* Default Properties */
	var width = 500;
	var height = 500;
	var dimensions = { x: 60, y: 40, z: 40 };
	var colors = ["green", "red", "yellow", "steelblue", "orange"];
	var classed = "d3X3domAreaChartMultiSeries";
	var debug = false;

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;
	var zScale = void 0;
	var colorScale = void 0;

	/* Components */
	var viewpoint = component.viewpoint();
	var axis = component.axisThreePlane();
	var areas = component.areaMultiSeries();
	var light = component.light();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	var init = function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
			rowKeys = _dataTransform$summar.rowKeys,
			columnKeys = _dataTransform$summar.columnKeys,
			valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];
		var _dimensions = dimensions,
			dimensionX = _dimensions.x,
			dimensionY = _dimensions.y,
			dimensionZ = _dimensions.z;

		xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);

		yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]).nice();

		zScale = d3.scaleBand().domain(rowKeys).range([0, dimensionZ]).padding(0.4);

		colorScale = d3.scaleOrdinal().domain(columnKeys).range(colors);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias areaChartMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	var my = function my(selection) {
		// Create x3d element (if it does not exist already)
		if (!x3d) {
			x3d = selection.append("x3d");
			scene = x3d.append("scene");
		}

		x3d.attr("width", width + "px").attr("height", height + "px").attr("showLog", debug ? "true" : "false").attr("showStat", debug ? "true" : "false");

		// Update the chart dimensions and add layer groups
		var layers = ["axis", "areas"];

		scene.classed(classed, true).selectAll("group").data(layers).enter().append("group").attr("class", function(d) {
			return d;
		});

		selection.each(function(data) {
			init(data);

			// Add Viewpoint
			viewpoint
				.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2])
				.viewOrientation([-0.61021, 0.77568, 0.16115, 0.65629])
				.viewPosition([77.63865, 54.69470, 104.38314]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Add Axis
			scene.select(".axis")
				.call(axis);

			// Add Series
			areas.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colors(colors)
				.dimensions(dimensions);

			scene.select(".areas")
				.datum(data)
				.call(areas);

			// Add Light
			scene.call(light);
		});
	};

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _v - X3D canvas width in px.
	 * @returns {*}
	 */
	my.width = function(_v) {
		if (!arguments.length) return width;
		width = _v;
		return this;
	};

	/**
	 * Height Getter / Setter
	 *
	 * @param {number} _v - X3D canvas height in px.
	 * @returns {*}
	 */
	my.height = function(_v) {
		if (!arguments.length) return height;
		height = _v;
		return this;
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
	 * Debug Getter / Setter
	 *
	 * @param {boolean} _v - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function(_v) {
		if (!arguments.length) return debug;
		debug = _v;
		return my;
	};

	return my;
}
