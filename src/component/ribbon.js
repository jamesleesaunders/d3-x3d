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
			xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([0, dimensions.x])
				.padding(0.3);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(extent)
				.range([0, dimensions.y]);
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

		selection.each((data) => {
			init(data);

			let ribbonData = data.values.map((d) => {
				const x = xScale(d.key);
				const y = yScale(d.value) / 2;
				const width = 5;
				const height = yScale(d.value);

				return {
					up: {
						key: d.key,
						value: d.value,
						translation: x + " " + y + " 0",
						rotation: "0,-1,0,1.57079633",
						size: width + " " + height
					},
					down: {
						key: d.key,
						value: d.value,
						translation: x + " " + y + " 0",
						rotation: "0,-1,0,1.57079633",
						size: width + " " + height
					}
				}
			});

			const ribbonSelect = selection.selectAll(".ribbon")
				.data(ribbonData);

			const ribbon = ribbonSelect.enter()
				.append("transform")
				.classed("ribbon", true)
				.attr("translation", (d) => d.up.translation)
				.attr("rotation", (d) => d.up.rotation)
				.append("shape");

			ribbon.append("rectangle2d")
				.attr("size", (d) => d.up.size)
				.attr("solid", "true");

			ribbon.append("appearance")
				.append("twosidedmaterial")
				.attr("diffuseColor", color);
		});
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} _v - 3D Object dimensions.
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

	return my;
}
