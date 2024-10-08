import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { attachEventListners, dispatch } from "../events.js";
import { colorParse } from "../colorHelper.js";

/**
 * Reusable 3D Donut Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "d3X3dDonut";

	/* Scales */
	let xScale;
	let yScale;
	let colorScale;
	let colorDomain = [];

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
		const { columnKeys, rowTotal } = dataTransform(data).summary();

		xScale = d3.scaleLinear()
			.domain([0, rowTotal])
			.range([0, (Math.PI * 2)]);

		yScale = d3.scaleLinear()
			.domain([0, rowTotal])
			.range([(Math.PI * 2), 0]);

		colorDomain = arrayUnique(colorDomain, columnKeys);
		colorScale = d3.scaleOrdinal()
			.domain(colorDomain)
			.range(colors);
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias donut
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const shape = (el) => {
				const shape = el.append("Shape");

				attachEventListners(shape);

				shape.append("Torus")
					.attr("containerField", "geometry")
					.attr("angle", (d) => xScale(d.value))
					.attr("innerRadius", 0.25)
					.attr("outerRadius", 1)
					.attr("useGeoCache", false)
					.attr("subdivision", "48,48");

				shape.append("Appearance")
					.append("Material")
					.attr("diffuseColor", (d) => {
						// If colour scale is linear then use value for scale.
						let color = colorScale(d.key);
						if (typeof colorScale.interpolate === "function") {
							color = colorScale(d.value);
						}
						return colorParse(color);
					});

				return shape;
			};

			const sectors = element.selectAll(".sector")
				.data((d) => dataTransform(d).stacked().values, (d) => d.key);

			const sectorsEnter = sectors.enter()
				.append("Transform")
				.classed("sector", true)
				.call(shape)
				.merge(sectors);

			const sectorsTransition = sectorsEnter.transition()
				.duration(300)
				.ease(d3.easeBounce)
				.attr("scale", () => [dimensionX, dimensionY, dimensionZ].map((d) => d / 2).join(" "))
				.attr("rotation", (d) => [0, 0, 1, yScale(d.y0)].join(" "));

			sectorsTransition.select("Shape")
				.select("Torus")
				.attr("angle", (d) => xScale(d.value));

			sectors.exit()
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
	 * Color Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 scale.
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
