import * as d3 from "d3";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Vector Field Chart
 *
 * @module
 *
 * @see https://mathinsight.org/vector_field_overview
 * @example
 * var chartHolder = d3.select("#chartholder");
 * var myData = [...];
 * var myChart = d3.x3dom.chart.vectorFieldChart();
 * chartHolder.datum(myData).call(myChart);
 */
export default function() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "blue";
	let classed = "x3dVectorFieldChart";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let sizeScale;
	let sizeDomain = [1, 6];

	/**
	 * Vector Field Function
	 *
	 * @param x
	 * @param y
	 * @param z
	 * @returns {{x: number, y: number, z: number}}
	 */
	let vectorFunction = function(x, y, z) {
		return {
			x: x,
			y: y,
			z: z
		};
	};

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { coordinatesMax, coordinatesMin } = dataTransform(data).summary();
		const { x: minX, y: minY, z: minZ } = coordinatesMin;
		const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		const extent = d3.extent(data.values.map((f) => {
			let vx, vy, vz;
			if ('vx' in f) {
				({ vx, vy, vz } = f);
			} else {
				({ x: vx, y: vy, z: vz } = vectorFunction(f.x, f.y, f.z));
			}

			return new x3dom.fields.SFVec3f(vx, vy, vz).length();
		}));

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain([minX, maxX])
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain([minY, maxY])
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain([minZ, maxZ])
				.range([0, dimensionZ]);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(extent)
				.range(sizeDomain);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias vectorFieldChart
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
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
			const axis = component.crosshair()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale);

			// Construct Vector Field Component
			const chart = component.vectorFields()
				.color(color)
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.sizeScale(sizeScale)
				.vectorFunction(vectorFunction);

			scene.select(".axis")
				.datum({ x: 0, y: 0, z: 0 })
				.call(axis);

			scene.select(".chart")
				.datum(data)
				.call(chart);
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
	 * Color Getter / Setter
	 *
	 * @param {string} _v - Color (e.g. 'red' or '#ff0000').
	 * @returns {*}
	 */
	my.color = function(_v) {
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
	my.debug = function(_v) {
		if (!arguments.length) return debug;
		debug = _v;
		return my;
	};

	/**
	 * Vector Function Getter / Setter
	 *
	 * @param {string} _v - Vector Function.
	 * @returns {*}
	 */
	my.vectorFunction = function(_v) {
		if (!arguments.length) return vectorFunction;
		vectorFunction = _v;
		return my;
	};

	return my;
}
