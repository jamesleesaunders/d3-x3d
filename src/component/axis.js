import * as d3 from "d3";
import { colorParse } from "../colorHelper";

/**
 * Reusable 3D Axis Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "black";
	let classed = "d3X3dAxis";
	let labelPosition = "proximal";
	let labelInset = labelPosition === "distal" ? 1 : -1;

	/* Scale and Axis Options */
	let scale;
	let direction;
	let tickDirection;
	let tickArguments = [];
	let tickValues = null;
	let tickFormat = null;
	let tickSize = 1.5;
	let tickPadding = 2.0;

	const axisDirectionVectors = {
		x: [1, 0, 0],
		y: [0, 1, 0],
		z: [0, 0, 1]
	};

	const axisRotationVectors = {
		x: [1, 1, 0, Math.PI],
		y: [0, 0, 0, 0],
		z: [0, 1, 1, Math.PI]
	};

	/**
	 * Get Axis Direction Vector
	 *
	 * @private
	 * @param {string} axisDir
	 * @returns {number[]}
	 */
	const getAxisDirectionVector = function(axisDir) {
		return axisDirectionVectors[axisDir];
	};

	/**
	 * Get Axis Rotation Vector
	 *
	 * @private
	 * @param {string} axisDir
	 * @returns {number[]}
	 */
	const getAxisRotationVector = function(axisDir) {
		return axisRotationVectors[axisDir];
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias axis
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	const my = function(selection) {
		selection.each(function() {

			const element = d3.select(this)
				.classed(classed, true);

			const range = scale.range();
			const range0 = range[0];
			const range1 = range[range.length - 1];

			const axisDirectionVector = getAxisDirectionVector(direction);
			const tickDirectionVector = getAxisDirectionVector(tickDirection);
			const axisRotationVector = getAxisRotationVector(direction);
			const tickRotationVector = getAxisRotationVector(tickDirection);

			/*
			// FIXME: Currently the tickArguments option does not work.
			const tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
			tickValues = tickValues === null ? tickValuesDefault : tickValues;
			*/
			tickValues = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();

			const tickFormatDefault = scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : (d) => d;
			tickFormat = tickFormat === null ? tickFormatDefault : tickFormat;

			const shape = (el, radius, height, color) => {
				const shape = el.append("Shape");

				shape.append("Cylinder")
					.attr("radius", radius)
					.attr("height", height);

				shape.append("Appearance")
					.append("Material")
					.attr("diffuseColor", colorParse(color));
			};

			const makeSolid = (el, color) => {
				el.append("Appearance")
					.append("Material")
					.attr("diffuseColor", colorParse(color) || "0 0 0");
			};

			// Main Lines
			const domain = element.selectAll(".domain")
				.data([null]);

			domain.enter()
				.append("Transform")
				.attr("class", "domain")
				.attr("rotation", axisRotationVector.join(" "))
				.attr("translation", axisDirectionVector.map((d) => (d * (range0 + range1) / 2)).join(" "))
				.call(shape, 0.1, range1 - range0, color)
				.merge(domain);

			domain.exit()
				.remove();

			// Tick Lines
			const ticks = element.selectAll(".tickLine")
				.data(tickValues, (d) => d);

			ticks.enter()
				.append("Transform")
				.attr("class", "tickLine")
				.attr("translation", (t) => (axisDirectionVector.map((a) => (scale(t) * a)).join(" ")))
				.append("Transform")
				.attr("translation", tickDirectionVector.map((d) => (d * tickSize / 2)).join(" "))
				.attr("rotation", tickRotationVector.join(" "))
				.call(shape, 0.05, tickSize, "#e3e3e3")
				.merge(ticks);

			ticks.transition()
				.attr("translation", (t) => (axisDirectionVector.map((a) => (scale(t) * a)).join(" ")));

			ticks.exit()
				.remove();

			// Tick Labels
			if (tickFormat !== "") {
				const labels = element.selectAll(".tickLabel")
					.data(tickValues, (d) => d);

				labels.enter()
					.append("Transform")
					.attr("class", "tickLabel")
					.attr("translation", (t) => (axisDirectionVector.map((a) => (scale(t) * a)).join(" ")))
					.append("Transform")
					.attr("translation", tickDirectionVector.map((d, i) => (labelInset * d * tickPadding) + (((labelInset + 1) / 2) * tickSize * tickDirectionVector[i])))
					.append("Billboard")
					.attr("axisOfRotation", "0 0 0")
					.append("Shape")
					.call(makeSolid, "black")
					.append("Text")
					.attr("string", (d) => `"${tickFormat(d)}"`)
					.append("FontStyle")
					.attr("size", 1.3)
					.attr("family", "\"SANS\"")
					.attr("style", "BOLD")
					.attr("justify", "\"MIDDLE\" \"MIDDLE\"")
					.merge(labels);

				labels.transition()
					.attr("translation", (t) => (axisDirectionVector.map((a) => (scale(t) * a)).join(" ")))
					.select("Transform")
					.attr("translation", tickDirectionVector.map((d, i) => (labelInset * d * tickPadding) + (((labelInset + 1) / 2) * tickSize * tickDirectionVector[i])))
					.on("start", function() {
						d3.select(this)
							.select("Billboard")
							.select("Shape")
							.select("Text")
							.attr("string", (d) => `"${tickFormat(d)}"`);
					});

				labels.exit()
					.remove();
			} else {
				element.selectAll(".tickLabel")
					.remove();
			}
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
		return my;
	};

	/**
	 * Scale Getter / Setter
	 *
	 * @param {d3.scale} _v - D3 Scale.
	 * @returns {*}
	 */
	my.scale = function(_v) {
		if (!arguments.length) return scale;
		scale = _v;
		return my;
	};

	/**
	 * Direction Getter / Setter
	 *
	 * @param {string} _v - Direction of Axis (e.g. "x", "y", "z").
	 * @returns {*}
	 */
	my.direction = function(_v) {
		if (!arguments.length) return direction;
		direction = _v;
		return my;
	};

	/**
	 * Tick Direction Getter / Setter
	 *
	 * @param {string} _v - Direction of Ticks (e.g. "x", "y", "z").
	 * @returns {*}
	 */
	my.tickDirection = function(_v) {
		if (!arguments.length) return tickDirection;
		tickDirection = _v;
		return my;
	};

	/**
	 * Tick Arguments Getter / Setter
	 *
	 * @param {Array} _v - Tick arguments.
	 * @returns {Array<*>}
	 */
	my.tickArguments = function(_v) {
		if (!arguments.length) return tickArguments;
		tickArguments = _v;
		return my;
	};

	/**
	 * Tick Values Getter / Setter
	 *
	 * @param {Array} _v - Tick values.
	 * @returns {*}
	 */
	my.tickValues = function(_v) {
		if (!arguments.length) return tickValues;
		tickValues = _v;
		return my;
	};

	/**
	 * Tick Format Getter / Setter
	 *
	 * @param {string} _v - Tick format.
	 * @returns {*}
	 */
	my.tickFormat = function(_v) {
		if (!arguments.length) return tickFormat;
		tickFormat = _v;
		return my;
	};

	/**
	 * Tick Size Getter / Setter
	 *
	 * @param {number} _v - Tick length.
	 * @returns {*}
	 */
	my.tickSize = function(_v) {
		if (!arguments.length) return tickSize;
		tickSize = _v;
		return my;
	};

	/**
	 * Tick Padding Getter / Setter
	 *
	 * @param {number} _v - Tick padding size.
	 * @returns {*}
	 */
	my.tickPadding = function(_v) {
		if (!arguments.length) return tickPadding;
		tickPadding = _v;
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
	 * Label Position Getter / Setter
	 *
	 * @param {string} _v - Position ("proximal" or "distal")
	 * @returns {*}
	 */
	my.labelPosition = function(_v) {
		if (!arguments.length) return labelPosition;
		labelPosition = _v;
		labelInset = labelPosition === "distal" ? 1 : -1;
		return my;
	};

	return my;
}
