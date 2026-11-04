import * as d3 from "d3";
import dataTransform from "../dataTransform.js";
import { dispatch } from "../events.js";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Particle Plot Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		colors: d3.schemeRdYlGn[8],
		color: undefined,
		mappings: undefined,
		xScale: undefined,
		yScale: undefined,
		zScale: undefined,
		colorScale: undefined
	};
	let classed = "d3X3dBubbles";

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
				let key = state.mappings[dimension];
				let value = d.values.find((v) => v.key === key).value;
				set.values.push({ key: key, value: value });
			});

			newData[dimension] = dataTransform(set).summary();
		});

		let extentX = newData.x.valueExtent;
		let extentY = newData.y.valueExtent;
		let extentZ = newData.z.valueExtent;
		let extentColor = newData.color.valueExtent;

		if (typeof state.xScale === "undefined") {
			state.xScale = d3.scaleLinear()
				.domain(extentX)
				.range([0, state.dimensions.x]);
		}

		if (typeof state.yScale === "undefined") {
			state.yScale = d3.scaleLinear()
				.domain(extentY)
				.range([0, state.dimensions.y]);
		}

		if (typeof state.zScale === "undefined") {
			state.zScale = d3.scaleLinear()
				.domain(extentZ)
				.range([0, state.dimensions.z]);
		}

		if (state.color) {
			state.colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range([state.color, state.color]);
		} else if (typeof state.colorScale === "undefined") {
			state.colorScale = d3.scaleQuantize()
				.domain(extentColor)
				.range(state.colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias particles
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
						let xVal = d.values.find((v) => v.key === state.mappings.x).value;
						let yVal = d.values.find((v) => v.key === state.mappings.y).value;
						let zVal = d.values.find((v) => v.key === state.mappings.z).value;
						return [state.xScale(xVal), state.yScale(yVal), state.zScale(zVal)];
					})
				};

				const pointColors = function(Y) {
					return Y.values.map(function(d) {
						let colorVal = d.values.find((v) => v.key === state.mappings.color).value;
						let color = d3.color(state.colorScale(colorVal));
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
	 * Dispatch On Getter
	 *
	 * @returns {*}
	 */
	my.on = function() {
		let value = dispatch.on.apply(dispatch, arguments);
		return value === dispatch ? my : value;
	};

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} xScale - D3 scale.
	 * @param {d3.scale} yScale - D3 scale.
	 * @param {d3.scale} zScale - D3 scale.
	 * @param {d3.scale} colorScale - D3 color scale.
	 * @param {string} color - Color (e.g. "red" or "#ff0000").
	 * @param {Array} colors - Array of colours used by color scale.
	 * @param {Object} mappings - Map properties to colour etc.
	 */
	attachAccessors(my, state);

	return my;
}
