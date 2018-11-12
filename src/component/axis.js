import * as d3 from "d3";

/**
 * Reusable 3D Axis
 *
 * @module
 */
export default function() {

	/* Default Properties */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "black";
	let classed = "x3dAxis";

	/* Scale and Axis Options */
	let scale;
	let dir;
	let tickDir;
	let tickArguments = [];
	let tickValues = null;
	let tickFormat = null;
	let tickSize = 1;
	let tickPadding = 1;

	/* Slice */
	const slice = Array.prototype.slice;

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
	function getAxisDirectionVector(axisDir) {
		return axisDirectionVectors[axisDir];
	}

	/**
	 * Get Axis Rotation Vector
	 *
	 * @private
	 * @param {string} axisDir
	 * @returns {number[]}
	 */
	function getAxisRotationVector(axisDir) {
		return axisRotationVectors[axisDir];
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias axis
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */
	function my(selection) {
		selection.classed(classed, true);

		const makeSolid = function(selection, color) {
			selection.append("appearance")
				.append("material")
				.attr("diffuseColor", color || "black");

			return selection;
		};

		const defaultValues = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
		const values = tickValues === null ? defaultValues : tickValues;

		const defaultFormat = scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : function(d) { return d; };
		const format = tickFormat === null ? defaultFormat : tickFormat;

		const range = scale.range();
		const range0 = range[0];
		const range1 = range[range.length - 1];

		const dirVec = getAxisDirectionVector(dir);
		const tickDirVec = getAxisDirectionVector(tickDir);
		const rotVec = getAxisRotationVector(dir);
		const tickRotVec = getAxisRotationVector(tickDir);

		let path = selection.selectAll("transform")
			.data([null]);

		let tick = selection.selectAll(".tick")
			.data(values, scale).order();

		const tickExit = tick.exit();
		const tickEnter = tick.enter()
			.append("transform")
			.attr("translation", function(t) {
				return dirVec.map(function(a) {
					return scale(t) * a;
				}).join(" ");
			})
			.attr("class", "tick");

		let line = tick.select(".tickLine");
		let text = tick.select("billboard");

		path = path.merge(path.enter()
			.append("transform")
			.attr("rotation", rotVec.join(" "))
			.attr("translation", dirVec.map(function(d) { return d * (range0 + range1) / 2; }).join(" "))
			.append("shape")
			.call(makeSolid, color)
			.attr("class", "domain"));
		tick = tick.merge(tickEnter);
		line = line.merge(tickEnter.append("transform"));
		let newText = tickEnter.append("transform");

		newText
			.attr("translation", tickDirVec.map(function(d) { return -d * tickPadding; }))
			.append("billboard")
			.attr("axisOfRotation", "0 0 0")
			.append("shape")
			.call(makeSolid, "black")
			.append("text")
			.attr("string", format)
			.append("fontstyle")
			.attr("size", 1.3)
			.attr("family", "SANS")
			.attr("style", "BOLD")
			.attr("justify", "MIDDLE");
		text = text.merge(newText);

		tickExit.remove();
		path
			.append("cylinder")
			.attr("radius", 0.1)
			.attr("height", range1 - range0);

		line
			.attr("translation", tickDirVec.map(function(d) {
				return d * tickSize / 2;
			}).join(" "))
			.attr("rotation", tickRotVec.join(" "))
			.attr("class", "tickLine")
			.append("shape")
			.call(makeSolid)
			.append("cylinder")
			.attr("radius", 0.05)
			.attr("height", tickSize);
	}

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} value - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(value) {
		if (!arguments.length) return dimensions;
		dimensions = value;
		return this;
	};

	/**
	 * Scale Getter / Setter
	 *
	 * @param {d3.scale} value - D3 Scale.
	 * @returns {*}
	 */
	my.scale = function(value) {
		if (!arguments.length) return scale;
		scale = value;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} value - Set/Set color e.g 'red' or '#ff0000'.
	 * @returns {*}
	 */
	my.color = function(value) {
		if (!arguments.length) return color;
		color = value;
		return my;
	};

	/**
	 * Direction
	 *
	 * @param value
	 * @returns {*}
	 */
	my.dir = function(value) {
		return arguments.length ? (dir = value, my) : dir;
	};

	/**
	 * Tick Direction
	 *
	 * @param value - Get/Set Tick Direction.
	 * @returns {*}
	 */
	my.tickDir = function(value) {
		return arguments.length ? (tickDir = value, my) : tickDir;
	};

	/**
	 * Get Ticks
	 * @todo How is this used? Replace with tickArguments()?
	 */
	my.ticks = function() {
		return tickArguments = slice.call(arguments), my;
	};

	/**
	 * Tick Arguments
	 *
	 * @param value - Get/Set Tick Arguments.
	 * @returns {Array<*>}
	 */
	my.tickArguments = function(value) {
		return arguments.length ? (tickArguments = value === null ? [] : slice.call(value), my) : tickArguments.slice();
	};

	/**
	 * Tick Values
	 *
	 * @param value - Get/Set Tick Values.
	 * @returns {*}
	 */
	my.tickValues = function(value) {
		return arguments.length ? (tickValues = value === null ? null : slice.call(value), my) : tickValues && tickValues.slice();
	};

	/**
	 * Tick Format
	 *
	 * @param value - Get/Set Tick Format.
	 * @returns {*}
	 */
	my.tickFormat = function(value) {
		return arguments.length ? (tickFormat = value, my) : tickFormat;
	};

	/**
	 * Tick Size
	 *
	 * @param value - Get/Set Tick Length.
	 * @returns {number}
	 */
	my.tickSize = function(value) {
		return arguments.length ? (tickSize = +value, my) : tickSize;
	};

	/**
	 * Tick Padding
	 *
	 * @param value - Get/Set Tick Padding Size.
	 * @returns {number}
	 */
	my.tickPadding = function(value) {
		return arguments.length ? (tickPadding = +value, my) : tickPadding;
	};

	return my;
}
