import * as d3 from "d3";
import dataTransform from "../dataTransform";
import { colorParse } from "../colorHelper";


/**
 * Reusable 3D Area Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 5 };
	let color = "blue";
	let transparency = 0.1;
	let classed = "d3X3dArea";
	let smoothed = d3.curveMonotoneX;

	/* Scales */
	let xScale;
	let yScale;

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
	 * @alias area
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true)
				.attr("id", (d) => d.key);

			const areaData = function(data) {
				const dimensionX = dimensions.x;

				if (smoothed) {
					data = dataTransform(data).smooth(smoothed);

					const keys = d3.extent(data.values.map((d) => d.key));
					xScale = d3.scaleLinear()
						.domain(keys)
						.range([0, dimensionX]);
				}

				let values = data.values;

				// Convert values into IFS coordinates
				let coords = values.map((pointThis, indexThis, array) => {
					let indexNext = indexThis + 1;
					if (indexNext >= array.length) {
						return null;
					}
					let pointNext = array[indexNext];

					let x1 = xScale(pointThis.key);
					let x2 = xScale(pointNext.key);
					let y1 = yScale(pointThis.value);
					let y2 = yScale(pointNext.value);

					return [x1, 0, 0, x1, y1, 0, x2, y2, 0, x2, 0, 0];
				}).filter((d) => d !== null);

				data.point = coords.map((d) => d.join(" ")).join(" ");
				data.coordIndex = coords.map((d, i) => {
					const offset = i * 4;
					return [offset, offset + 1, offset + 2, offset + 3, -1].join(" ");
				}).join(" ");

				return [data];
			};

			const shape = (el) => {
				const shape = el.append("Shape");

				/*
				// FIXME: x3dom cannot have empty IFS nodes, we must to use .html() rather than .append() & .attr().
				shape.append("IndexedFaceset")
					.attr("coordIndex", (d) => d.coordIndex)
					.append("Coordinate")
					.attr("point", (d) => d.point);

				shape.append("Appearance")
					.append("Material")
					.attr("diffuseColor", colorParse(color))
					.attr("transparency", transparency);
				*/

				shape.html((d) => `
					<IndexedFaceset coordIndex="${d.coordIndex}" solid="false">
						<Coordinate point="${d.point}"></Coordinate>
					</IndexedFaceset>
					<Appearance>
						<Material diffuseColor="${colorParse(color)}" transparency="${transparency}"></Material>
					</Appearance>
				`);
			};

			const area = element.selectAll(".area")
				.data((d) => areaData(d), (d) => d.key);

			area.enter()
				.append("Group")
				.classed("area", true)
				.call(shape)
				.merge(area);

			const areaTransition = area.transition().select("Shape");

			areaTransition.select("IndexedFaceset")
				.attr("coordIndex", (d) => d.coordIndex)
				.select("Coordinate")
				.attr("point", (d) => d.point);

			areaTransition.select("Appearance")
				.select("Material")
				.attr("diffuseColor", colorParse(color));

			area.exit()
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
	 * @param {string} _v - Color (e.g. "red" or "#ff0000").
	 * @returns {*}
	 */
	my.color = function(_v) {
		if (!arguments.length) return color;
		color = _v;
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
