import * as d3 from "d3";
import dataTransform from "../dataTransform";

/**
 * Reusable 3D Bubble Chart Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "orange";
	let classed = "x3dBubbles";

	/* Scales */
	let xScale;
	let yScale;
	let zScale;
	let sizeScale;
	let sizeDomain = [0.5, 4.0];

	let dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

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
		selection.classed(classed, true);

		selection.each((data) => {
			init(data);

			const makeSolid = (selection, color) => {
				selection
					.append("appearance")
					.append("material")
					.attr("diffusecolor", color || "black");
				return selection;
			};

			const bubbles = selection.selectAll(".bubble")
				.data((d) => d.values);

			const bubblesEnter = bubbles.enter()
				.append("group")
				.attr("class", "bubble")
				.attr("onmouseover", "d3.select(this).select('billboard').attr('render', true);")
				.attr("onmouseout", "d3.select(this).select('billboard').attr('render', false);");

			bubblesEnter
				.append("transform")
				.attr("translation", (d) => (xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z)))
				.append("shape")
				.attr("onclick", "d3.x3dom.events.forwardMouseClick(event);")
				.on("click", function(e) { dispatch.call("customClick", this, e); })
				.attr("onmouseover", "d3.x3dom.events.forwardMouseOver(event);")
				.on("mouseover", function(e) { dispatch.call("customMouseOver", this, e); })

				.call(makeSolid, color)
				.append("sphere")
				.attr("radius", (d) => sizeScale(d.value));

			bubblesEnter
				.append("transform")
				.attr("translation", (d) => (xScale(d.x) + " " + yScale(d.y) + " " + zScale(d.z)))
				.append("billboard")
				.attr("render", false)
				.attr("axisofrotation", "0 0 0")
				.append("transform")
				.attr("translation", (d) => {
					let r = (sizeScale(d.value) / 2) + 0.6;
					return r + " " + r + " " + r;
				})
				.append("shape")
				.call(makeSolid, "blue")
				.append("text")
				.attr("string", (d) => d.key)
				.append("fontstyle")
				.attr("size", 1)
				.attr("family", "SANS")
				.attr("style", "BOLD")
				.attr("justify", "START");

			bubblesEnter.merge(bubbles);

			bubbles.transition()
				.attr("translation", (d) => (xScale(d.x) + ' ' + yScale(d.y) + ' ' + zScale(d.z)));

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
	 * Dispatch Getter / Setter
	 *
	 * @param {d3.dispatch} _v - Dispatch event handler.
	 * @returns {*}
	 */
	my.dispatch = function(_v) {
		if (!arguments.length) return dispatch();
		dispatch = _v;
		return this;
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
