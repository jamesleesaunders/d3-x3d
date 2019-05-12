import * as d3 from "d3";
import dataTransform from "../dataTransform";


/**
 * Reusable 3D Area Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 5 };
	let color = "blue";
	let transparency = 0.0;
	let classed = "d3X3domArea";

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

			let areaData = function(d) {
				let points = d.map(function(point) {
					let x = xScale(point.key);
					let y = yScale(point.value);

					return [x, y, 0];
				});

				points.unshift([0, 0, 0]);
				points.push([dimensions.x, 0, 0]);

				return {
					key: d.key,
					point: points.map((d) => d.join(" ")).join(" "),
					coordindex: points.map((d, i) => i).join(" ") + " -1"
				};
			};

			let shape = function(el) {
				const shape = el.append("shape");

				// FIXME: x3dom cannot have empty IFS nodes
				shape.html((d) => `
					<indexedfaceset coordindex='${d.coordindex}' solid='false'>
						<coordinate point='${d.point}' ></coordinate>
					</indexedfaceset>
					<appearance>
						<material diffuseColor='${color}' transparency='${transparency}'></material>
					</appearance>
				`);

				return shape;
			};

			let element = d3.select(this)
				.classed(classed, true)
				.attr("id", function(d) { return d.key; });

			let area = element.selectAll("group")
				.data([areaData(data.values)], function(d) { return d.key });

			area.enter()
				.append("group")
				.classed("area", true)
				.call(shape)
				.merge(area);

			/*
			area.transition()
				.select("shape")
				.select("appearance")
				.select("material")
				.attr("diffusecolor", function(d) { return d.color; });

			area.exit().remove();
			*/
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
