import * as d3 from "d3";

const axisDirectionVectors = {
	x: [1, 0, 0],
	y: [0, 1, 0],
	z: [0, 0, 1]
}

const axisRotationVectors = {
	x: [1, 1, 0, Math.PI],
	y: [0, 0, 0, 0],
	z: [0, 1, 1, Math.PI]
}

/**
 * Reusable 3D Axis
 *
 * @module
 */
export default function() {

	/**
	 * Default Properties
	 */
	let dimensions = { x: 40, y: 40, z: 40 };
	let color = "black";
	let classed = "x3dAxis";

	/**
	 * Scale and Axis Options
	 */
	let scale;
	let dir;
	let tickDir;
	let tickArguments = [];
	let tickValues = null;
	let tickFormat = null;
	let tickSize = 1;
	let tickPadding = 1;

	/**
	 * Get Axis Direction Vector
	 *
	 * @param {string} axisDir
	 * @returns {[number, number, number]}
	 */
	function getAxisDirectionVector(axisDir) {
		return axisDirectionVectors[axisDir];
	}

	/**
	 * Get Axis Rotation Vector
	 *
	 * @param {string} axisDir
	 * @returns {[number, number, number, number]}
	 */
	function getAxisRotationVector(axisDir) {
		return axisRotationVectors[axisDir];
	}

	/**
	 * Constructor
	 *
	 * @constructor
	 * @param {d3.selection} selection
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
	 * Slice
	 *
	 * @type {<T>(start?: number, end?: number) => T[]}
	 */
	let slice = Array.prototype.slice;

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: number, y: number, z: number}} _ - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	/**
	 * Scale Getter / Setter
	 *
	 * @param {d3.scale} _ - D3 Scale.
	 * @returns {*}
	 */
	my.scale = function(_) {
		if (!arguments.length) return scale;
		scale = _;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _ - Color 'red' or '#ff0000'.
	 * @returns {*}
	 */
	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return my;
	};

	/**
	 * Direction
	 *
	 * @param _
	 * @returns {*}
	 */
	my.dir = function(_) {
		return arguments.length ? (dir = _, my) : dir;
	};

	/**
	 * Tick Direction
	 *
	 * @param _
	 * @returns {*}
	 */
	my.tickDir = function(_) {
		return arguments.length ? (tickDir = _, my) : tickDir;
	};

	/**
	 * Ticks
	 *
	 */
	my.ticks = function() {
		return tickArguments = slice.call(arguments), my;
	};

	/**
	 * Tick Arguments
	 *
	 * @param _
	 * @returns {*[]}
	 */
	my.tickArguments = function(_) {
		return arguments.length ? (tickArguments = _ === null ? [] : slice.call(_), my) : tickArguments.slice();
	};

	/**
	 * Tick Values
	 *
	 * @param _
	 * @returns {*}
	 */
	my.tickValues = function(_) {
		return arguments.length ? (tickValues = _ === null ? null : slice.call(_), my) : tickValues && tickValues.slice();
	};

	/**
	 * Tick Format
	 *
	 * @param _
	 * @returns {*}
	 */
	my.tickFormat = function(_) {
		return arguments.length ? (tickFormat = _, my) : tickFormat;
	};

	/**
	 * Tick Size
	 *
	 * @param _
	 * @returns {number}
	 */
	my.tickSize = function(_) {
		return arguments.length ? (tickSize = +_, my) : tickSize;
	};

	/**
	 * Tick Padding
	 *
	 * @param _
	 * @returns {number}
	 */
	my.tickPadding = function(_) {
		return arguments.length ? (tickPadding = +_, my) : tickPadding;
	};

	return my;
}
