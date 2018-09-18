import * as d3 from "d3";
import { default as dataTransform } from "../dataTransform";

/**
 * Reusable 3D Axis
 *
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
	 * Constructor
	 */
	function my(selection) {
		selection.classed(classed, true);

		let identity = function(x) {
			return x;
		};

		let makeSolid = function(selection, color) {
			selection.append("appearance")
				.append("material")
				.attr("diffuseColor", color || "black");

			return selection;
		};

		let values = tickValues === null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues;
		let format = tickFormat === null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat;
		let range = scale.range();
		let range0 = range[0];
		let range1 = range[range.length - 1];

		function getAxisDirectionVector(axisDir) {
			let result;
			switch (axisDir) {
				case "x": {
					result = [1, 0, 0];
					break;
				}
				case "y": {
					result = [0, 1, 0];
					break;
				}
				case "z": {
					result = [0, 0, 1];
					break;
				}
			}

			return result;
		}

		function getAxisRotationVector(axisDir) {
			let result;
			switch (axisDir) {
				case "x": {
					result = [1, 1, 0, Math.PI];
					break;
				}
				case "y": {
					result = [0, 0, 0, 0];
					break;
				}
				case "z": {
					result = [0, 1, 1, Math.PI];
					break;
				}
			}

			return result;
		}

		let dirVec = getAxisDirectionVector(dir);
		let tickDirVec = getAxisDirectionVector(tickDir);
		let rotVec = getAxisRotationVector(dir);
		let tickRotVec = getAxisRotationVector(tickDir);

		let path = selection.selectAll("transform")
			.data([null]);

		let tick = selection.selectAll(".tick")
			.data(values, scale).order();

		let tickExit = tick.exit();
		let tickEnter = tick.enter()
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
			.attr("size", 1)
			.attr("family", "SANS")
			.attr("style", "BOLD")
			.attr("justify", "MIDDLE ");
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
	 * Configuration Getters & Setters
	 */
	let slice = Array.prototype.slice;

	my.dimensions = function(_) {
		if (!arguments.length) return dimensions;
		dimensions = _;
		return this;
	};

	my.scale = function(_) {
		if (!arguments.length) return scale;
		scale = _;
		return my;
	};

	my.color = function(_) {
		if (!arguments.length) return color;
		color = _;
		return my;
	};

	my.dir = function(_) {
		return arguments.length ? (dir = _, my) : dir;
	};

	my.tickDir = function(_) {
		return arguments.length ? (tickDir = _, my) : tickDir;
	};

	my.ticks = function() {
		return tickArguments = slice.call(arguments), my;
	};

	my.tickArguments = function(_) {
		return arguments.length ? (tickArguments = _ === null ? [] : slice.call(_), my) : tickArguments.slice();
	};

	my.tickValues = function(_) {
		return arguments.length ? (tickValues = _ === null ? null : slice.call(_), my) : tickValues && tickValues.slice();
	};

	my.tickFormat = function(_) {
		return arguments.length ? (tickFormat = _, my) : tickFormat;
	};

	my.tickSize = function(_) {
		return arguments.length ? (tickSize = +_, my) : tickSize;
	};

	my.tickPadding = function(_) {
		return arguments.length ? (tickPadding = +_, my) : tickPadding;
	};

	return my;
}
