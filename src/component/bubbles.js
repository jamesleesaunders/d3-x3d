import * as d3 from "d3";
import dataTransform from "../dataTransform";
import { dispatch } from "../events";

/**
 * Reusable 3D Bubble Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "orange";
	let classed = "d3X3domBubbles";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let sizeScale;
	let sizeDomain = [0.5, 4.0];

	let transition = { ease: d3.easeBounce, duration: 500 };

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	const init = function(data) {
		const { valueExtent, coordinatesMax } = dataTransform(data).summary();
		const { x: maxX, y: maxY, z: maxZ } = coordinatesMax;
		const { x: dimensionX, y: dimensionY, z: dimensionZ } = dimensions;

		if (typeof xScale === "undefined") {
			xScale = d3.scaleLinear()
				.domain([0, maxX])
				.range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear()
				.domain([0, maxY])
				.range([0, dimensionY]);
		}

		if (typeof zScale === "undefined") {
			zScale = d3.scaleLinear()
				.domain([0, maxZ])
				.range([0, dimensionZ]);
		}

		if (typeof sizeScale === "undefined") {
			sizeScale = d3.scaleLinear()
				.domain(valueExtent)
				.range(sizeDomain);
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
				.classed(classed, true);

			const makeSolid = (shape, color) => {
				shape
					.append("appearance")
					.append("material")
					.attr("diffusecolor", color || "black")
					.attr("ambientintensity", 0.1);
				return shape;
			};

			const bubbles = element.selectAll(".bubble")
				.data((d) => d.values);

			const bubblesEnter = bubbles.enter()
				.append("transform")
				.attr("class", "bubble")
				.attr("translation", (d) => (xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z)));

			const shape = bubblesEnter.append("shape")
				.attr("onclick", "d3.x3dom.events.forwardEvent(event);")
				.on("click", function(e) { dispatch.call("d3X3domClick", this, e); })
				.attr("onmouseover", "d3.x3dom.events.forwardEvent(event);")
				.on("mouseover", function(e) { dispatch.call("d3X3domMouseOver", this, e); })
				.attr("onmouseout", "d3.x3dom.events.forwardEvent(event);")
				.on("mouseout", function(e) { dispatch.call("d3X3domMouseOut", this, e); });

			shape.append("sphere")
				.attr("radius", (d) => sizeScale(d.value));

			shape.append("appearance")
				.append("material")
				.attr("diffusecolor", color)
				.attr("ambientintensity", 0.1);

			bubblesEnter.merge(bubbles);

			bubbles.transition()
				.attr("translation", (d) => (xScale(d.x) + ' ' + yScale(d.y) + ' ' + zScale(d.z)))
				.select("shape")
				.select("sphere")
				.attr("radius", (d) => sizeScale(d.value));

			bubbles.exit()
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
	 * Size Domain Getter / Setter
	 *
	 * @param {number[]} _v - Size min and max (e.g. [1, 9]).
	 * @returns {*}
	 */
	my.sizeDomain = function(_v) {
		if (!arguments.length) return sizeDomain;
		sizeDomain = _v;
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
