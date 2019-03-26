import * as d3 from "d3";
// import * as x3dom from "x3dom";
import dataTransform from "../dataTransform";
import component from "../component";

/**
 * Reusable 3D Vector Field Chart
 *
 * @module
 *
 * @example
 * let chartHolder = d3.select("#chartholder");
 *
 * let myData = [...];
 *
 * let vectorFunction = (x, y, z, value) => {
 *    return {
 *       vx: Math.pow(x, 2) + y * Math.pow(x, 2),
 *       vy: Math.pow(y, 2) - x * Math.pow(z, 2),
 *       vz: Math.pow(z, 2)
 *    };
 * };
 *
 * let myChart = d3.x3dom.chart.vectorFieldChart()
 *    .vectorFunction(vectorFunction);
 *
 * chartHolder.datum(myData).call(myChart);
 *
 * @see https://mathinsight.org/vector_field_overview
 */
export default function() {

	/* Default Properties */
	let width = 500;
	let height = 500;
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = d3.interpolateRdYlGn;
	let classed = "d3X3domVectorFieldChart";
	let debug = false;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeDomain = [2.0, 5.0];
	let origin = { x: 0, y: 0, z: 0 };

	/**
	 * Vector Field Function
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 * @param {number} value
	 * @returns {{vx: number, vy: number, vz: number}}
	 */
	let vectorFunction = function(x, y, z, value = null) {
		return {
			vx: x,
			vy: y,
			vz: z
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
				({ vx, vy, vz } = vectorFunction(f.x, f.y, f.z, f.value));
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

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleSequential()
				.domain(extent.slice().reverse())
				.interpolator(colors);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(extent)
				.range(sizeDomain);
		}

		// TODO: Have a think about whether this is appropriate?
		// Or, do we always want the origin to be 0,0,0 ?
		origin = {
			x: (minX < 0) ? 0 : minX,
			y: (minY < 0) ? 0 : minY,
			z: (minZ < 0) ? 0 : minZ
		};
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
		const layers = ["axis", "vectorFields"];
		scene.classed(classed, true)
			.selectAll("group")
			.data(layers)
			.enter()
			.append("group")
			.attr("class", (d) => d);

		selection.each((data) => {
			init(data);

			// Construct Viewpoint Component
			const viewpoint = component.viewpoint()
				.centerOfRotation([dimensions.x / 2, dimensions.y / 2, dimensions.z / 2]);

			// Construct Axis Component
			const axis = component.crosshair()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.dimensions(dimensions);

			// Construct Vector Field Component
			const vectorFields = component.vectorFields()
				.xScale(xScale)
				.yScale(yScale)
				.zScale(zScale)
				.colorScale(colorScale)
				.sizeScale(sizeScale)
				.vectorFunction(vectorFunction);

			scene.call(viewpoint);

			scene.select(".axis")
				.datum(origin)
				.call(axis);

			scene.select(".vectorFields")
				.datum((d) => d)
				.call(vectorFields);
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
	 * Size Domain Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [0.5, 3.0]).
	 * @returns {*}
	 */
	my.sizeDomain = function(_v) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _v;
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
	 * @param {function} _f - Vector Function.
	 * @returns {*}
	 */
	my.vectorFunction = function(_f) {
		if (!arguments.length) return vectorFunction;
		vectorFunction = _f;
		return my;
	};

	return my;
}
