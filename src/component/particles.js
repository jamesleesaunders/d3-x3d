import * as d3 from "d3";
import dataTransform from "../dataTransform";
import { dispatch } from "../events";
import { colorParse } from "../colorHelper";

/**
 * Reusable 3D Particle Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let colors = d3.schemeRdYlGn[8];
	let color;
	let classed = "d3X3dBubbles";
	let mappings;

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let colorScale;

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
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		let newData = {};
		['x', 'y', 'z', 'color'].forEach((dimension) => {
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
	 * @alias bubbles
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const particleData = function(data) {
				const pointCoords = function(Y) {
					return Y.values.map(function(d) {
						let xVal = d.values.find((v) => v.key === mappings.x).value;
						let yVal = d.values.find((v) => v.key === mappings.y).value;
						let zVal = d.values.find((v) => v.key === mappings.z).value;
						return [xScale(xVal), yScale(yVal), zScale(zVal)];
					})
				};

				const pointColors = function(Y) {
					return Y.values.map(function(d) {
						let colorVal = d.values.find((v) => v.key === mappings.color).value;
						let color = d3.color(colorScale(colorVal));
						return colorParse(color);
					})
				};

				data.point = array2dToString(pointCoords(data));
				data.color = array2dToString(pointColors(data));

				return [data];
			};

			const shape = (el) => {
				const shape = el.append("Shape");

				/*
				// FIXME: x3dom cannot have empty IFS nodes, we must to use .html() rather than .append() & .attr().
				const appearance = shape.append("Appearance");
				appearance.append("PointProperties")
					.attr("colorMode", "POINT_COLOR")
					.attr("pointSizeMinValue", 1)
					.attr("pointSizeMaxValue", 100)
					.attr("pointSizeScaleFactor", 5);

				const pointset = shape.append("PointSet");
				pointset.append("Coordinate")
					.attr("point", (d) => d.point);
				pointset.append("Color")
					.attr("color", (d) => d.color);
				*/

				shape.html((d) => `
					<Appearance>
						<PointProperties colorMode="POINT_COLOR" pointSizeMinValue="1" pointSizeMaxValue="100" pointSizeScaleFactor="5"></PointProperties>
					</Appearance>
					<PointSet>
						<Coordinate point="${d.point}"></Coordinate>
						<Color color="${d.color}"></Color>
					</IndexedFaceset>
				  `);
			};

			const particles = element.selectAll(".particle")
				.data((d) => particleData(d), (d) => d.key);

			particles.enter()
				.append("Group")
				.classed("particle", true)
				.call(shape)
				.merge(particles);

			const particleTransition = particles.transition().select("Shape");

			particleTransition.select("PointSet")
				.select("Coordinate")
				.attr("point", (d) => d.point);

			particleTransition.select("PointSet")
				.select("Color")
				.attr("color", (d) => d.color);
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
	 * @param {Object} _v - Map properties to colour etc.
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
