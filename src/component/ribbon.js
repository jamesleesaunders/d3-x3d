import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Ribbon Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "red";
	let classed = "x3dRibbon";

	/* Scales */
	let xScale;
	let yScale;

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	function init(data) {
		const { columnKeys, maxValue } = dataTransform(data).summary();
		const extent = [0, maxValue];

		if (typeof xScale === "undefined") {
			xScale = d3.scaleBand().domain(columnKeys).rangeRound([0, dimensions.x]).padding(0.3);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(extent).range([0, dimensions.y]);
		}
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias ribbon
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.classed(classed, true);

		selection.each(function(data) {
			init(data);

			const ribbonSelect = selection.selectAll(".point")
				.data(function(d) { return d.values; });

			const ribbon = ribbonSelect.enter()
				.append("transform")
				.attr("translation", function(d) {
					const x = xScale(d.key);
					const y = yScale(d.value) / 2;
					return x + " " + y + " 0";
				})
				.attr("rotation", function() {
					return "0,-1,0,1.57079633";
				})
				.append("shape");

			ribbon.append("rectangle2d")
				.attr("size", function(d) {
					const width = 5;
					const height = yScale(d.value);
					return width + " " + height;
				})
				.attr("solid", "true");

			ribbon.append("appearance")
				.append("twosidedmaterial")
				.attr("diffuseColor", color);
		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} _x - 3D Object dimensions.
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

	return my;
}
