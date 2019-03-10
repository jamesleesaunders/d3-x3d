import * as d3 from "d3";

/**
 * Reusable 3D Axis Component
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "black";
	let classed = "d3X3domAxis";

	/* Scale and Axis Options */
	let scale;
	let direction;
	let tickDirection;
	let tickArguments = [];
	let tickValues = null;
	let tickFormat = null;
	let tickSize = 1;
	let tickPadding = 1;

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

			const makeSolid = (shape, color) => {
				shape.append("appearance")
					.append("material")
					.attr("diffuseColor", color || "black");
				return shape;
			};

			const range = scale.range();
			const range0 = range[0];
			const range1 = range[range.length - 1];

			const axisDirectionVector = getAxisDirectionVector(direction);
			const tickDirectionVector = getAxisDirectionVector(tickDirection);
			const axisRotationVector = getAxisRotationVector(direction);
			const tickRotationVector = getAxisRotationVector(tickDirection);

			let path = element.selectAll("transform")
				.data([null]);

			const tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
			tickValues = tickValues === null ? tickValuesDefault : tickValues;

			let tick = selection.selectAll(".tick")
				.data(tickValues, scale).order();

			const tickExit = tick.exit();
			const tickEnter = tick.enter()
				.append("transform")
				.attr("translation", (t) => (axisDirectionVector.map((a) => (scale(t) * a)).join(" ")))
				.attr("class", "tick");

			let line = tick.select(".tickLine");
			path = path.merge(path.enter()
				.append("transform")
				.attr("rotation", axisRotationVector.join(" "))
				.attr("translation", axisDirectionVector.map((d) => (d * (range0 + range1) / 2)).join(" "))
				.append("shape")
				.call(makeSolid, color)
				.attr("class", "domain"));
			tick = tick.merge(tickEnter);
			line = line.merge(tickEnter.append("transform"));

			const tickFormatDefault = scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : (d) => d;
			tickFormat = tickFormat === null ? tickFormatDefault : tickFormat;

			if (tickFormat !== "") {
				let text = tick.select("billboard");
				let newText = tickEnter.append("transform");
				newText
					.attr("translation", tickDirectionVector.map((d) => (-d * tickPadding)))
					.append("billboard")
					.attr("axisofrotation", "0 0 0")
					.append("shape")
					.call(makeSolid, "black")
					.append("text")
					.attr("string", tickFormat)
					.append("fontstyle")
					.attr("size", 1.3)
					.attr("family", "SANS")
					.attr("style", "BOLD")
					.attr("justify", "MIDDLE");
				text = text.merge(newText);
			}

			tickExit.remove();
			path
				.append("cylinder")
				.attr("radius", 0.1)
				.attr("height", range1 - range0);

			line
				.attr("translation", tickDirectionVector.map((d) => (d * tickSize / 2)).join(" "))
				.attr("rotation", tickRotationVector.join(" "))
				.attr("class", "tickLine")
				.append("shape")
				.call(makeSolid, "#d3d3d3")
				.append("cylinder")
				.attr("radius", 0.05)
				.attr("height", tickSize);
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
	 * @param {string} _v - Direction of Axis (e.g. 'x', 'y', 'z').
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
	 * @param {string} _v - Direction of Ticks (e.g. 'x', 'y', 'z').
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
