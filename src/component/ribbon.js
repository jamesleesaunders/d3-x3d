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

			const ribbonData = function(d) {
				return d.values.map((pointThis, indexThis, array) => {
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

					function array2dToString(arr) {
						return arr.reduce((a, b) => a.concat(b), [])
							.reduce((a, b) => a.concat(b), [])
							.join(" ");
					}

					function arrayToCoordIndex(arr) {
						return arr.map((d, i) => i)
							.join(" ")
							.concat(" -1");
					}

					return {
						key: pointThis.key,
						value: pointThis.value,
						color: color,
						transparency: 0.2,
						coordindex: arrayToCoordIndex(points),
						point: array2dToString(points)
					}
				}).filter((d) => d !== null);
			};

			let ribbonSelect = selection.selectAll(".ribbon")
				.data(ribbonData);

			let ribbon = ribbonSelect.enter()
				.append("shape")
				.classed("ribbon", true);

			ribbon.append("indexedfaceset")
				.attr("coordindex", (d) => d.coordindex)
				.attr("solid", true)
				.append("coordinate")
				.attr("point", (d) => d.point);

			ribbon.append("appearance")
				.append("twosidedmaterial")
				.attr("diffuseColor", (d) => d.color)
				.attr("transparency", (d) => d.transparency);

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
