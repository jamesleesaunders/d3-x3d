import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Bar Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 2 };
	let colors = ["orange", "red", "yellow", "steelblue", "green"];
	let classed = "d3X3domBars";

	/* Scales */
	let xScale;
	let yScale;
	let colorScale;

	let transition = { ease: d3.easeBounce, duration: 500 };

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
			xScale = d3.scaleBand()
				.domain(columnKeys)
				.rangeRound([0, dimensionX])
				.padding(0.3);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain(valueExtent)
				.range([0, dimensionY]);
		}

		if (typeof colorScale === "undefined") {
			colorScale = d3.scaleOrdinal()
				.domain(columnKeys)
				.range(colors);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias bars
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function(data) {
			init(data);

			const element = d3.select(this)
				.classed(classed, true);

			const bars = element.selectAll(".bar")
				.data((d) => d.values);

			const barsEnter = bars.enter()
				.append("transform")
				.classed("bar", true)
				.attr("scale", (d) => {
					let x = xScale.bandwidth();
					let y = yScale(d.value);
					let z = dimensions.z;
					return x + " " + y + " " + z;
				})
				.attr("translation", (d) => {
					let x = xScale(d.key);
					let y = yScale(d.value) / 2;
					let z = 0.0;
					return x + " " + y + " " + z;
				});

			const shape = barsEnter.append("shape");

			shape.append("box")
				.attr("size", "1.0 1.0 1.0");

			shape.append("appearance")
				.append("material")
				.attr("diffusecolor", (d) => colorScale(d.key))
				.attr("ambientintensity", 0.1);

			barsEnter.merge(bars);

			bars.transition()
				.ease(transition.ease)
				.duration(transition.duration)
				.attr("scale", (d) => {
					let x = xScale.bandwidth();
					let y = yScale(d.value);
					let z = dimensions.z;
					return x + " " + y + " " + z;
				})
				.attr("translation", (d) => {
					let x = xScale(d.key);
					let y = yScale(d.value) / 2;
					let z = 0.0;
					return x + " " + y + " " + z;
				});

			bars.exit()
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

	return my;
}
