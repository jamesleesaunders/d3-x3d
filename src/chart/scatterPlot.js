import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Scatter Plot Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 * let myData = [...];
 * let myChart = d3.x3dom.chart.scatterPlot();
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 */
export default function () {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = {x: 40, y: 40, z: 40};
	let color = "orange";
	let classed = "x3dScatterPlot";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;

	let dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function (data) {
		const {coordinatesMax} = dataTransform(data).summary();
		const {x: maxX, y: maxY, z: maxZ} = coordinatesMax;
		const {x: dimensionX, y: dimensionY, z: dimensionZ} = dimensions;

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain([0, maxX])
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain([0, maxY])
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain([0, maxZ])
				.range([0, dimensionZ]);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias scatterPlot
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function (selection) {
		const x3d = selection.append("x3d")
			.attr("width", width + "px")
			.attr("height", height + "px");

		if (debug) {
			x3d.attr("showLog", "true").attr("showStat", "true")
		}

		let scene = x3d.append("scene");

		// Update the chart dimensions and add layer groups
		const layers = ["axis", "bubbles", "crosshair", "label"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", (d) => d);

		scene.each((data) => {
			init(data);

			// Construct Viewpoint Component
			const viewpoint = component.viewpoint()
				.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			const axis = component.axisThreePlane()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Crosshair Component
			const crosshair = component.crosshair()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Label Component
			const label = component.label()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Bubbles Component
			const bubbles = component.bubbles()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.color(color)
				.sizeDomain([0.5, 0.5])
				.dispatch(dispatch)
				.on("customClick", function (e) {
					scene.select(".crosshair")
						.datum(d3.select(e.target).datum())
						.classed("crosshair", true)
						.each(function () {
							d3.select(this).call(crosshair);
						});
				})
				.on("customMouseOver", function (e) {
					scene.select(".label")
						.datum(d3.select(e.target).datum())
						.each(function () {
							d3.select(this).call(label);
						});
				})
				.on("customMouseOut", function (e) {
					scene.select(".label").selectAll("*").remove();
				});

			scene.call(viewpoint);

			scene.select(".axis")
				.call(axis);

			scene.select(".bubbles")
				.datum((d) => d)
				.call(bubbles);
		});
	};

	/**
	 * Width Getter / Setter
	 *
	 * @param {number} _v - X3D canvas width in px.
	 * @returns {*}
	 */
	my.width = function (_v) {
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
	my.height = function (_v) {
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
	my.dimensions = function (_v) {
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
	my.xScale = function (_v) {
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
	my.yScale = function (_v) {
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
	my.zScale = function (_v) {
		if (!arguments.length) return zScale;
		zScale = _v;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _v - Color (e.g. 'red' or '#ff0000').
	 * @returns {*}
	 */
	my.color = function (_v) {
		if (!arguments.length) return color;
		color = _v;
		return my;
	};

	/**
	 * Debug Getter / Setter
	 *
	 * @param {boolean} _v - Show debug log and stats. True/False.
	 * @returns {*}
	 */
	my.debug = function (_v) {
		if (!arguments.length) return debug;
		debug = _v;
		return my;
	};

	/**
	 * Dispatch On Getter
	 *
	 * @returns {*}
	 */
	my.on = function () {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	return my;
}
