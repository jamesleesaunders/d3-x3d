import * as d3 from "d3";
import dataTransform from "../dataTransform";
import { dispatch } from "../events";

/**
 * Reusable 3D Ribbon Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 5 };
	let color = "red";
	let transparency = 0.2;
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

			const ribbonData = function(data) {
				let values = data.values;

				return values.map((pointThis, indexThis, array) => {
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
						coordIndex: arrayToCoordIndex(points),
						point: array2dToString(points)
					};
				}).filter((d) => d !== null);
			};

			const shape = (el) => {
				const shape = el.append("Shape");

				shape.attr("onclick", "d3.x3dom.events.forwardEvent(event);")
					.on("click", function(e) { dispatch.call("d3X3domClick", this, e); })
					.attr("onmouseover", "d3.x3dom.events.forwardEvent(event);")
					.on("mouseover", function(e) { dispatch.call("d3X3domMouseOver", this, e); })
					.attr("onmouseout", "d3.x3dom.events.forwardEvent(event);")
					.on("mouseout", function(e) { dispatch.call("d3X3domMouseOut", this, e); });

				/*
				// FIXME: x3dom cannot have empty IFS nodes, we must to use .html() rather than .append() & .attr().
				shape.append("IndexedFaceset")
					.attr("coordIndex", (d) => d.coordIndex)
					.append("Coordinate")
					.attr("point", (d) => d.point);

				shape.append("Appearance")
					.append("TwoSidedMaterial")
					.attr("diffuseColor", color)
					.attr("transparency", transparency);
				*/

				shape.html((d) => `
					<IndexedFaceset coordIndex="${d.coordIndex}">
						<Coordinate point="${d.point}"></Coordinate>
					</IndexedFaceset>
					<Appearance>
						<TwoSidedMaterial diffuseColor="${color}" transparency="${transparency}"></TwoSidedMaterial>
					</Appearance>
				`);
			};

			const ribbon = element.selectAll(".ribbon")
				.data((d) => ribbonData(d), (d) => d.key);

			ribbon.enter()
				.append("group")
				.classed("ribbon", true)
				.call(shape)
				.merge(ribbon);

			const ribbonTransition = ribbon.transition().select("Shape");

			ribbonTransition.select("IndexedFaceset")
				.attr("coordIndex", (d) => d.coordIndex)
				.select("Coordinate")
				.attr("point", (d) => d.point);

			ribbonTransition.select("Appearance")
				.select("TwoSidedMaterial")
				.attr("diffuseColor", (d) => d.color);

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
