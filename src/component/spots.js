import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { dispatch } from "../events.js";
import { colorParse } from "../colorHelper.js";

/**
 * Reusable 3D Spot Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = d3.schemeRdYlGn[8];
	let color;
	let classed = "d3X3dSpots";
	let mappings;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;
	let sizeScale;
	let sizeRange = [0.5, 3.5];
	let plane = "x";

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

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain(extentX)
				.range([0, dimensions.x]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(extentY)
				.range([0, dimensions.y]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain(extentZ)
				.range([0, dimensions.z]);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(extentSize)
				.range(sizeRange);
		}

		if (color) {
			colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range([color, color]);
		} else if (typeof colorScale === "undefined") {
			colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range(colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias spots
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			function getPositionVector(d) {
				let xVal = xScale(d.values.find((v) => v.key === mappings.x).value);
				let yVal = yScale(d.values.find((v) => v.key === mappings.y).value);
				let zVal = zScale(d.values.find((v) => v.key === mappings.z).value);

				const positionVectors = {
					x: [0, yVal, zVal],
					y: [xVal, 0, zVal],
					z: [xVal, yVal, 0]
				};

				return positionVectors[plane].join(" ");
			}

			function getRotationVector() {
				const rotationVectors = {
					x: [1, 1, 0, Math.PI],
					y: [0, 0, 0, 0],
					z: [0, 1, 1, Math.PI]
				};

				return rotationVectors[plane].join(" ");
			}

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const shape = (el) => {
				const shape = el.append("Shape");

				shape.append("Cylinder")
					.attr("radius", (d) => {
						let sizeVal = d.values.find((v) => v.key === mappings.size).value;
						return sizeScale(sizeVal);
					})
					.attr("height", 0.1);

				shape.append("Appearance")
					.append("Material")
					.attr("transparency", 0.1)
					.attr("diffuseColor", (d) => {
						let colorVal = d.values.find((v) => v.key === mappings.color).value;
						return colorParse(colorScale(colorVal));
					});

				return shape;
			};

			const spots = element.selectAll(".spot")
				.data((d) => d.values, (d) => d.key);

			const spotsEnter = spots.enter()
				.append("Transform")
				.attr("class", "spot")
				.call(shape)
				.merge(spots);

			const spotsTransition = spotsEnter.transition();
			spotsTransition
				.attr("translation", (d) => getPositionVector(d))
				.attr("rotation", (d) => getRotationVector());

			spotsTransition.select("Shape")
				.select("Cylinder")
				.attr("radius", (d) => {
					let sizeVal = d.values.find((v) => v.key === mappings.size).value;
					return sizeScale(sizeVal);
				});

			spotsTransition.select("Shape")
				.select("Appearance")
				.select("Material")
				.attr("diffuseColor", (d) => {
					let colorVal = d.values.find((v) => v.key === mappings.color).value;
					return colorParse(colorScale(colorVal));
				});

			spots.exit()
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
	 * PLane Getter / Setter
	 *
	 * @param {string} _v - Plane of Spots (e.g. "x", "y", "z").
	 * @returns {*}
	 */
	my.plane = function(_v) {
		if (!arguments.length) return plane;
		plane = _v;
		return my;
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
	 * @param {d3.scale} _v - D3 size scale.
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
