import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Scatter Plot Chart
 *
 * @module
 *
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.scatterPlot();
 * chartHolder.datum(myData).call(myChart);
 */
export default function() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "orange";
	let classed = "x3dScatterPlot";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { maxCoordinates } = dataTransform(data).summary();

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear().domain([0, maxCoordinates.x]).range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain([0, maxCoordinates.y]).range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear().domain([0, maxCoordinates.z]).range([0, dimensions.z]);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias scatterPlot
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		const x3d = selection.append("x3d")
			.attr("width", width + "px")
			.attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true")
		}

		let scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		const layers = ["axis", "chart"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", (d) => d);

		const viewpoint = component.viewpoint()
			.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);
		scene.call(viewpoint);

		scene.each((data) => {
			init(data);

			// Construct Axis Component
			const axis = component.axisThreePlane()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Bubbles Component
			const chart = component.bubbles()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.color(color)
				.sizeDomain([0.5, 0.5]);

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
	 * Color Getter / Setter
	 *
	 * @param {string} _x - Color (e.g. 'red' or '#ff0000').
	 * @returns {*}
	 */
	my.color = function(_x) {
		if (!arguments.length) return color;
		color = _x;
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
