import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Ribbon Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 5 };
	let color = "red";
	let classed = "d3X3domRibbon";

	/* Scales */
	let xScale;
	let yScale;

	/**
	 * Array to String
	 *
	 * @private
	 * @param {array} arr
	 * @returns {string}
	 */
	const array2dToString = function(arr) {
		return arr.reduce((a, b) => a.concat(b), [])
			.reduce((a, b) => a.concat(b), [])
			.join(" ");
	};

	/**
	 * Array to Coordinate Index
	 *
	 * @private
	 * @param {array} arr
	 * @returns {string}
	 */
	const arrayToCoordIndex = function(arr) {
		return arr.map((d, i) => i)
			.join(" ")
			.concat(" -1");
	};

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { columnKeys, valueMax } = dataTransform(data).summary();
		const valueExtent = [0, valueMax];
		const { x: dimensionX, y: dimensionY } = dimensions;

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
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias ribbon
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const ribbonData = function(d) {
				return d.map((pointThis, indexThis, array) => {
					let indexNext = indexThis + 1;
					if (indexNext >= array.length) {
						return null;
					}
					let pointNext = array[indexNext];

					const x1 = xScale(pointThis.key);
					const x2 = xScale(pointNext.key);
					const y1 = yScale(pointThis.value);
					const y2 = yScale(pointNext.value);
					const z1 = 1 - (dimensions.z) / 2;
					const z2 = (dimensions.z) / 2;

					const points = [
						[x1, y1, z1],
						[x1, y1, z2],
						[x2, y2, z2],
						[x2, y2, z1],
						[x1, y1, z1]
					];

					return {
						key: pointThis.key,
						value: pointThis.value,
						coordindex: arrayToCoordIndex(points),
						point: array2dToString(points),
						color: color,
						transparency: 0.2
					};
				}).filter((d) => d !== null);
			};

			const shape = (el) => {
				const shape = el.append("shape");

				shape.append("indexedfaceset")
					.attr("coordindex", (d) => d.coordindex)
					.append("coordinate")
					.attr("point", (d) => d.point);

				shape.append("appearance")
					.append("twosidedmaterial")
					.attr("diffusecolor", (d) => d.color)
					.attr("transparency", (d) => d.transparency);

				return shape;
			};

			const ribbon = element.selectAll(".ribbon")
				.data((d) => ribbonData(d.values), (d) => d.key);

			ribbon.enter()
				.append("group")
				.classed("ribbon", true)
				.call(shape)
				.merge(ribbon)
				.transition()
				.select("indexedfaceset")
				.attr("coordindex", (d) => d.coordindex)
				.select("coordinate")
				.attr("point", (d) => d.point);

			ribbon.exit()
				.remove();

		});
	};

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
