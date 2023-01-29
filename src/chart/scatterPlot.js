import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import component from "../component.js";
import { dispatch } from "../events.js";
import { createScene } from "../base.js";

/**
 * Reusable 3D Scatter Plot Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let myChart = d3.x3d.chart.scatterPlot();
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://datavizproject.com/data-type/3d-scatterplot/
 */
export default function() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["orange"];
	let color;
	let classed = "d3X3dScatterPlot";
	let mappings;
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeRange = [0.2];

	/* Components */
	const viewpoint = component.viewpoint();
	const axis = component.axisThreePlane();
	const crosshair = component.crosshair();
	const label = component.label();
	const bubbles = component.bubbles();

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {

		let newData = {};
		['x', 'y', 'z', 'size', 'color'].forEach((dimension) => {
			let set = {
				key: dimension,
				values: []
			};

			data.values.forEach((d) => {
				let key = mappings[dimension];
				let value = d.values.find((v) => v.key === key).value;
				set.values.push({ key: key, value: value });
			});

			newData[dimension] = dataTransform(set).summary();
		});

		let extentX = newData.x.valueExtent;
		let extentY = newData.y.valueExtent;
		let extentZ = newData.z.valueExtent;
		let extentSize = newData.size.valueExtent;
		let extentColor = newData.color.valueExtent;

		xScale = d3.scaleLinear()
			.domain(extentX)
			.range([0, dimensions.x]);

		yScale = d3.scaleLinear()
			.domain(extentY)
			.range([0, dimensions.y]);

		zScale = d3.scaleLinear()
			.domain(extentZ)
			.range([0, dimensions.z]);

		sizeScale = d3.scaleLinear()
			.domain(extentSize)
			.range(sizeRange);

		if (color) {
			colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range([color, color]);
		} else {
			colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range(colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias scatterPlot
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		const layers = ["axis", "bubbles", "crosshair", "label"];
		const scene = createScene(selection, layers, classed, width, height, debug);

		selection.each((data) => {
			init(data);

			// Add Viewpoint
			viewpoint.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			scene.call(viewpoint);

			// Add Axis
			axis.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			scene.select(".axis")
				.call(axis);

			// Add Crosshair
			crosshair.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Add Labels
			label.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.offset(0.5);

			// Add Bubbles
			bubbles.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.sizeScale(sizeScale)
				.colorScale(colorScale)
				.mappings(mappings)
				.on("d3X3dClick", function(e) {
					const datum = d3.select(e.target).datum();
					let xVal = datum.values.find((v) => v.key === "x").value;
					let yVal = datum.values.find((v) => v.key === "y").value;
					let zVal = datum.values.find((v) => v.key === "z").value;
					const d = { x: xVal, y: yVal, z: zVal };

					scene.select(".crosshair")
						.datum(d)
						.classed("crosshair", true)
						.each(function() {
							d3.select(this).call(crosshair);
						});
				})
				.on("d3X3dMouseOver", function(e) {
					const datum = d3.select(e.target).datum();
					let xVal = datum.values.find((v) => v.key === "x").value;
					let yVal = datum.values.find((v) => v.key === "y").value;
					let zVal = datum.values.find((v) => v.key === "z").value;
					const d = { x: xVal, y: yVal, z: zVal, key: datum.key };

					scene.select(".label")
						.datum(d)
						.each(function() {
							d3.select(this).call(label);
						});
				})
				.on("d3X3dMouseOut", function(e) {
					scene.select(".label")
						.selectAll("*")
						.remove();
				});

			scene.select(".bubbles")
				.datum(data)
				.call(bubbles);
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
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Size Range Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [1, 9]).
	 * @returns {*}
	 */
	my.sizeRange = function(_v) {
		if (!arguments.length) return sizeRange;
		sizeRange = _v;
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
	 * Color Getter / Setter
	 *
	 * @param {string} _v - Color (e.g. "red" or "#ff0000").
	 * @returns {*}
	 */
	my.color = function(_v) {
		if (!arguments.length) return color;
		color = _v;
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
	 * Size Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 color scale.
	 * @returns {*}
	 */
	my.sizeScale = function(_v) {
		if (!arguments.length) return sizeScale;
		sizeScale = _v;
		return my;
	};

	/**
	 * Size Range Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [0.5, 3.0]).
	 * @returns {*}
	 */
	my.sizeRange = function(_v) {
		if (!arguments.length) return sizeRange;
		sizeRange = _v;
		return my;
	};

	/**
	 * Mappings Getter / Setter
	 *
	 * @param {Object} _v - Map properties to size, colour etc.
	 * @returns {*}
	 */
	my.mappings = function(_v) {
		if (!arguments.length) return mappings;
		mappings = _v;
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
