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

		const range = scale.range();
		const range0 = range[0];
		const range1 = range[range.length - 1];

		const dirVec = getAxisDirectionVector(dir);
		const tickDirVec = getAxisDirectionVector(tickDir);
		const rotVec = getAxisRotationVector(dir);
		const tickRotVec = getAxisRotationVector(tickDir);

		let path = selection.selectAll("transform")
			.data([null]);

		const tickValuesDefault = scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain();
		tickValues = tickValues === null ? tickValuesDefault : tickValues;

		let tick = selection.selectAll(".tick")
			.data(tickValues, scale).order();

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
		path = path.merge(path.enter()
			.append("transform")
			.attr("rotation", rotVec.join(" "))
			.attr("translation", dirVec.map(function(d) { return d * (range0 + range1) / 2; }).join(" "))
			.append("shape")
			.call(makeSolid, color)
			.attr("class", "domain"));
		tick = tick.merge(tickEnter);
		line = line.merge(tickEnter.append("transform"));

		const tickFormatDefault = scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : function(d) { return d; };
		tickFormat = tickFormat === null ? tickFormatDefault : tickFormat;

		if (tickFormat !== "") {
			let text = tick.select("billboard");
			let newText = tickEnter.append("transform");
			newText
				.attr("translation", tickDirVec.map(function(d) { return -d * tickPadding; }))
				.append("billboard")
				.attr("axisOfRotation", "0 0 0")
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
	 * @param {{x: number, y: number, z: number}} _x - 3D object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function(_x) {
		return arguments.length ? (dimensions = _x, my) : dimensions;
	};

	/**
	 * Scale Getter / Setter
	 *
	 * @param {d3.scale} _x - D3 Scale.
	 * @returns {*}
	 */
	my.scale = function(_x) {
		return arguments.length ? (scale = _x, my) : scale;
	};

	/**
	 * Direction Getter / Setter
	 *
	 * @param _x - Direction.
	 * @returns {*}
	 */
	my.dir = function(_x) {
		return arguments.length ? (dir = _x, my) : dir;
	};

	/**
	 * Tick Direction Getter / Setter
	 *
	 * @param _x - Tick direction.
	 * @returns {*}
	 */
	my.tickDir = function(_x) {
		return arguments.length ? (tickDir = _x, my) : tickDir;
	};

	/**
	 * Tick Arguments Getter / Setter
	 *
	 * @param _x - Tick arguments.
	 * @returns {Array<*>}
	 */
	my.tickArguments = function(_x) {
		return arguments.length ? (tickArguments = _x, my) : tickArguments;
	};

	/**
	 * Tick Values Getter / Setter
	 *
	 * @param _x - Tick values.
	 * @returns {*}
	 */
	my.tickValues = function(_x) {
		return arguments.length ? (tickValues = _x, my) : tickValues;
	};

	/**
	 * Tick Format Getter / Setter
	 *
	 * @param _x - Tick format.
	 * @returns {*}
	 */
	my.tickFormat = function(_x) {
		return arguments.length ? (tickFormat = _x, my) : tickFormat;
	};

	/**
	 * Tick Size Getter / Setter
	 *
	 * @param _x - Tick length.
	 * @returns {number}
	 */
	my.tickSize = function(_x) {
		return arguments.length ? (tickSize = _x, my) : tickSize;
	};

	/**
	 * Tick Padding Getter / Setter
	 *
	 * @param _x - Tick padding size.
	 * @returns {number}
	 */
	my.tickPadding = function(_x) {
		return arguments.length ? (tickPadding = _x, my) : tickPadding;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _x - Color e.g. 'red' or '#ff0000'.
	 * @returns {*}
	 */
	my.color = function(_x) {
		return arguments.length ? (color = _x, my) : color;
	};

	return my;
}
