import * as d3 from "d3";
import dataTransform from "../dataTransform";
import componentArea from "./area";


/**
 * Reusable 3D Multi Series Area Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "d3X3dAreaMultiSeries";
	let smoothed = d3.curveMonotoneX;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let colorDomain = [];

	/* Components */
	const area = componentArea();

	/**
	 * Unique Array
	 *
	 * @param {array} array1
	 * @param {array} array2
	 * @returns {array}
	 */
	const arrayUnique = function(array1, array2) {
		let array = array1.concat(array2);

		let a = array.concat();
		for (let i = 0; i < a.length; ++i) {
			for (let j = i + 1; j < a.length; ++j) {
				if (a[i] === a[j]) {
					a.splice(j--, 1);
				}
			}
		}

		return a;
	};

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { rowKeys, columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		if (typeof xScale === "undefined") {
			xScale = d3.scalePoint()
				.domain(columnKeys)
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleBand()
				.domain(rowKeys)
				.range([0, dimensionZ])
				.padding(0.4);
		}

		if (typeof colorScale === "undefined") {
			colorDomain = arrayUnique(colorDomain, rowKeys);
			colorScale = d3.scaleOrdinal()
				.domain(colorDomain)
				.range(colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias areaMultiSeries
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true);

			area.xScale(xScale)
				.yScale(yScale)
				.dimensions({
					x: dimensions.x,
					y: dimensions.y,
					z: zScale.bandwidth()
				})
				.smoothed(smoothed);

			const addArea = function(d) {
				const color = colorScale(d.key);
				area.color(color);
				d3.select(this).call(area);
			};

			const areaGroup = element.selectAll(".areaGroup")
				.data((d) => d, (d) => d.key);

			areaGroup.enter()
				.append("Transform")
				.classed("areaGroup", true)
				.merge(areaGroup)
				.transition()
				.attr("translation", (d) => {
					const x = 0;
					const y = 0;
					const z = zScale(d.key);
					return x + " " + y + " " + z;
				})
				.each(addArea);

			areaGroup.exit()
				.remove();
		});
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
	 * Smooth Interpolation Getter / Setter
	 *
	 * Options:
	 *   d3.curveBasis
	 *   d3.curveLinear
	 *   d3.curveMonotoneX
	 *
	 * @param {d3.curve} _v.
	 * @returns {*}
	 */
	my.smoothed = function(_v) {
		if (!arguments.length) return smoothed;
		smoothed = _v;
		return my;
	};

	return my;
}
