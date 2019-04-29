/**
 * Reusable 3D Area Chart Component
 *
 * @module
 */
function componentArea () {

	/* Default Properties */
	var dimensions = { x: 40, y: 40, z: 5 };
	var color = "red";
	var transparency = 0.0;
	var classed = "d3X3domArea";

	/* Scales */
	var xScale = void 0;
	var yScale = void 0;

	/**
	 * Array to String
	 *
	 * @private
	 * @param {array} arr
	 * @returns {string}
	 */
	var array2dToString = function array2dToString(arr) {
		return arr.reduce(function (a, b) {
			return a.concat(b);
		}, []).reduce(function (a, b) {
			return a.concat(b);
		}, []).join(" ");
	};

	/**
	 * Array to Coordinate Index
	 *
	 * @private
	 * @param {array} arr
	 * @returns {string}
	 */
	var arrayToCoordIndex = function arrayToCoordIndex(arr, offset) {
		return arr.map(function (d, i) {
			return i + offset;
		}).join(" ").concat(" -1");
	};

	/**
	 * Initialise Data and Scales
	 *
	 * @private
	 * @param {Array} data - Chart data.
	 */
	var init = function init(data) {
		var _dataTransform$summar = dataTransform(data).summary(),
			columnKeys = _dataTransform$summar.columnKeys,
			valueMax = _dataTransform$summar.valueMax;

		var valueExtent = [0, valueMax];
		var _dimensions = dimensions,
			dimensionX = _dimensions.x,
			dimensionY = _dimensions.y;


		if (typeof xScale === "undefined") {
			xScale = d3.scalePoint().domain(columnKeys).range([0, dimensionX]);
		}

		if (typeof yScale === "undefined") {
			yScale = d3.scaleLinear().domain(valueExtent).range([0, dimensionY]);
		}
	};

	/**
	 * Constructor
	 *
	 * @constructor
	 * @alias area
	 * @param {d3.selection} selection - The chart holder D3 selection.
	 */

	var my = function my(selection) {
		selection.each(function (data) {
			init(data);

			var element = d3.select(this).classed(classed, true).attr("id", function (d) {
				return d.key;
			})
				.append("group").classed("area", true)
				.append("shape")
				.attr("onclick", "d3.x3dom.events.forwardEvent(event);").on("click", function (e) {
					dispatch.call("d3X3domClick", this, e);
				}).attr("onmouseover", "d3.x3dom.events.forwardEvent(event);").on("mouseover", function (e) {
					dispatch.call("d3X3domMouseOver", this, e);
				}).attr("onmouseout", "d3.x3dom.events.forwardEvent(event);").on("mouseout", function (e) {
					dispatch.call("d3X3domMouseOut", this, e);
				});

			//x3dom cannot have empty IFS nodes
			element.html(`
				<IndexedFaceSet coordIndex='' solid='false'>
					<Coordinate point=''></Coordinate>
				</IndexedFaceSet>
				<Appearance>
					<Material diffuseColor='${color}' transparency='${transparency}'></Material>
				</Appearance>
			`);

			var areaData = function areaData(d) {
				return d.map(function (pointThis, indexThis, array) {
					var indexNext = indexThis + 1;
					if (indexNext >= array.length) {
						return null;
					}
					var pointNext = array[indexNext];

					var x1 = xScale(pointThis.key);
					var x2 = xScale(pointNext.key);
					var y1 = yScale(pointThis.value);
					var y2 = yScale(pointNext.value);
					var z1 = 1 - dimensions.z / 2;
					var z2 = dimensions.z / 2;

					var points = [[x1, 0, z1], [x1, y1, z1], [x2, y2, z1], [x2, 0, z1]];

					return {
						key: pointThis.key,
						value: pointThis.value,
						points: points,
						color: color,
						transparency: 0.2
					};
				}).filter(function (d) {
					return d !== null;
				});
			};

			var ifs = element.select("IndexedFaceSet");
			var coord = ifs.select("Coordinate");

			var area = ifs.selectAll('.area')
				.data(d => areaData(d.values), d => d.key);

			function addIndices (d) {
				var point = coord.attr("point");
				if (typeof point !== 'string') { point = ''}; //getAttribute is redefined by x3dom and does not work for ''
				coord.attr("point", point + " " + array2dToString(d.points));
				var lastIndex3 = point.split(" ").length - 1;
				var coordIndex = ifs.attr("coordIndex") + " ";
				ifs.attr("coordIndex", coordIndex + arrayToCoordIndex(d.points, lastIndex3/3));

			}

			area.enter().each(addIndices);

			area.exit().remove();
		});
	};

	/**
	 * Dimensions Getter / Setter
	 *
	 * @param {{x: {number}, y: {number}, z: {number}}} _v - 3D Object dimensions.
	 * @returns {*}
	 */
	my.dimensions = function (_v) {
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
	my.xScale = function (_v) {
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
	my.yScale = function (_v) {
		if (!arguments.length) return yScale;
		yScale = _v;
		return my;
	};

	/**
	 * Color Getter / Setter
	 *
	 * @param {string} _v - Color (e.g. 'red' or '#ff0000').
	 * @returns {*}
	 */
	my.color = function (_v) {
		if (!arguments.length) return color;
		color = _v;
		return my;
	};

	return my;
}
