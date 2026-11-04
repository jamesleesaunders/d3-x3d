import * as d3 from "d3";
import { colorParse } from "../colorHelper.js";
import { attachAccessors } from "../accessors.js";

/**
 * Reusable 3D Axis Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	const state = {
		dimensions: { x: 40, y: 40, z: 40 },
		color: "black",
		scale: undefined,
		direction: undefined,
		tickDirection: undefined,
		tickArguments: [],
		tickValues: null,
		tickFormat: null,
		tickSize: 1.5,
		tickPadding: 2.0
	};
	let classed = "d3X3dAxis";
	let labelPosition = "proximal";
	let labelInset = labelPosition === "distal" ? 1 : -1;

	/**
	 * Get Axis Direction Vector
	 *
	 * @private
	 * @param {string} axisDir
	 * @returns {number[]}
	 */
	const getAxisDirectionVector = function(axisDir) {
		const axisDirectionVectors = {
			x: [1, 0, 0],
			y: [0, 1, 0],
			z: [0, 0, 1]
		};

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
		const axisRotationVectors = {
			x: [1, 1, 0, Math.PI],
			y: [0, 0, 0, 0],
			z: [0, 1, 1, Math.PI]
		};

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

			const range = state.scale.range();
			const range0 = range[0];
			const range1 = range[range.length - 1];

			const axisDirectionVector = getAxisDirectionVector(state.direction);
			const tickDirectionVector = getAxisDirectionVector(state.tickDirection);
			const axisRotationVector = getAxisRotationVector(state.direction);
			const tickRotationVector = getAxisRotationVector(state.tickDirection);

			/*
			// FIXME: Currently the tickArguments option does not work.
			const tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
			tickValues = tickValues === null ? tickValuesDefault : tickValues;
			*/
			state.tickValues = state.scale.ticks ? state.scale.ticks.apply(state.scale, state.tickArguments) : state.scale.domain();

			const tickFormatDefault = state.scale.tickFormat ? state.scale.tickFormat.apply(state.scale, state.tickArguments) : (d) => d;
			state.tickFormat = state.tickFormat === null ? tickFormatDefault : state.tickFormat;

			const makeSolid = (el, color) => {
				el.append("Appearance")
					.append("Material")
					.attr("diffuseColor", colorParse(color) || "0 0 0")
					.attr("transparency", "0");
			};

			const shape = (el, radius, height, color) => {
				const shape = el.append("Shape");

				shape.append("Cylinder")
					.attr("radius", radius)
					.attr("height", height);

				shape.call(makeSolid, colorParse(color));
			};

			// Main Lines
			const domain = element.selectAll(".domain")
				.data([null]);

			domain.enter()
				.append("Transform")
				.attr("class", "domain")
				.attr("rotation", axisRotationVector.join(" "))
				.attr("translation", axisDirectionVector.map((d) => (d * (range0 + range1) / 2)).join(" "))
				.call(shape, 0.1, range1 - range0, state.color)
				.merge(domain);

			domain.exit()
				.remove();

			// Tick Lines
			const ticks = element.selectAll(".tickLine")
				.data(state.tickValues, (d) => d);

			ticks.enter()
				.append("Transform")
				.attr("class", "tickLine")
				.attr("translation", (t) => (axisDirectionVector.map((a) => (state.scale(t) * a)).join(" ")))
				.append("Transform")
				.attr("translation", tickDirectionVector.map((d) => (d * state.tickSize / 2)).join(" "))
				.attr("rotation", tickRotationVector.join(" "))
				.call(shape, 0.05, state.tickSize, "#f3f3f3")
				.merge(ticks);

			ticks.transition()
				.attr("translation", (t) => (axisDirectionVector.map((a) => (state.scale(t) * a)).join(" ")));

			ticks.exit()
				.remove();

			// Tick Labels
			const labels = element.selectAll(".tickLabel")
				.data(state.tickValues, (d) => d);

			labels.enter()
				.append("Transform")
				.attr("class", "tickLabel")
				.attr("translation", (t) => (axisDirectionVector.map((a) => (state.scale(t) * a)).join(" ")))
				.append("Transform")
				.attr("translation", tickDirectionVector.map((d, i) => (labelInset * d * state.tickPadding) + (((labelInset + 1) / 2) * state.tickSize * tickDirectionVector[i])))
				.append("Billboard")
				.attr("axisOfRotation", "0 0 0")
				.append("Shape")
				.call(makeSolid, "black")
				.append("Text")
				.attr("string", (d) => `"${state.tickFormat(d)}"`)
				.append("FontStyle")
				.attr("size", 1.3)
				.attr("family", "\"SANS\"")
				.attr("style", "BOLD")
				.attr("justify", "\"MIDDLE\" \"MIDDLE\"")
				.merge(labels);

			labels.transition()
				.attr("translation", (t) => (axisDirectionVector.map((a) => (state.scale(t) * a)).join(" ")))
				.select("Transform")
				.attr("translation", tickDirectionVector.map((d, i) => (labelInset * d * state.tickPadding) + (((labelInset + 1) / 2) * state.tickSize * tickDirectionVector[i])))
				.on("start", function() {
					d3.select(this)
						.select("Billboard")
						.select("Shape")
						.select("Text")
						.attr("string", (d) => `"${state.tickFormat(d)}"`);
				});

			labels.exit()
				.remove();

		});
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

	/**
	 * Getter / setters. No argument returns the value. One argument sets it and returns the component.
	 *
	 * @param {{x: number, y: number, z: number}} dimensions - 3D object dimensions.
	 * @param {d3.scale} scale - D3 Scale.
	 * @param {string} direction - Direction of Axis (e.g. "x", "y", "z").
	 * @param {string} tickDirection - Direction of Ticks (e.g. "x", "y", "z").
	 * @param {Array} tickArguments - Tick arguments.
	 * @param {Array} tickValues - Tick values.
	 * @param {string} tickFormat - Tick format.
	 * @param {number} tickSize - Tick length.
	 * @param {number} tickPadding - Tick padding size.
	 * @param {string} color - Color (e.g. "red" or "#ff0000").
	 */
	attachAccessors(my, state);

	return my;
}
