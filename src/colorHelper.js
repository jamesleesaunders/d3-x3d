// @formatter:off
/**
 * Definition of CSS color names
 * @type {Array}
 */
const colorNames = {
		aliceblue: "#f0f8ff",          antiquewhite: "#faebd7",         aqua: "#00ffff",
		aquamarine: "#7fffd4",         azure: "#f0ffff",                beige: "#f5f5dc",
		bisque: "#ffe4c4",             black: "#000000",                blanchedalmond: "#ffebcd",
		blue: "#0000ff",               blueviolet: "#8a2be2",           brown: "#a52a2a",
		burlywood: "#deb887",          cadetblue: "#5f9ea0",            chartreuse: "#7fff00",
		chocolate: "#d2691e",          coral: "#ff7f50",                cornflowerblue: "#6495ed",
		cornsilk: "#fff8dc",           crimson: "#dc143c",              cyan: "#00ffff",
		darkblue: "#00008b",           darkcyan: "#008b8b",             darkgoldenrod: "#b8860b",
		darkgray: "#a9a9a9",           darkgreen: "#006400",            darkkhaki: "#bdb76b",
		darkmagenta: "#8b008b",        darkolivegreen: "#556b2f",       darkorange: "#ff8c00",
		darkorchid: "#9932cc",         darkred: "#8b0000",              darksalmon: "#e9967a",
		darkseagreen: "#8fbc8f",       darkslateblue: "#483d8b",        darkslategray: "#2f4f4f",
		darkturquoise: "#00ced1",      darkviolet: "#9400d3",           deeppink: "#ff1493",
		deepskyblue: "#00bfff",        dimgray: "#696969",              dodgerblue: "#1e90ff",
		feldspar: "#d19275",           firebrick: "#b22222",            floralwhite: "#fffaf0",
		forestgreen: "#228b22",        fuchsia: "#ff00ff",              gainsboro: "#dcdcdc",
		ghostwhite: "#f8f8ff",         gold: "#ffd700",                 goldenrod: "#daa520",
		gray: "#808080",               green: "#008000",                greenyellow: "#adff2f",
		honeydew: "#f0fff0",           hotpink: "#ff69b4",              indianred : "#cd5c5c",
		indigo : "#4b0082",            ivory: "#fffff0",                khaki: "#f0e68c",
		lavender: "#e6e6fa",           lavenderblush: "#fff0f5",        lawngreen: "#7cfc00",
		lemonchiffon: "#fffacd",       lightblue: "#add8e6",            lightcoral: "#f08080",
		lightcyan: "#e0ffff",          lightgoldenrodyellow: "#fafad2", lightgrey: "#d3d3d3",
		lightgreen: "#90ee90",         lightpink: "#ffb6c1",            lightsalmon: "#ffa07a",
		lightseagreen: "#20b2aa",      lightskyblue: "#87cefa",         lightslateblue: "#8470ff",
		lightslategray: "#778899",     lightsteelblue: "#b0c4de",       lightyellow: "#ffffe0",
		lime: "#00ff00",               limegreen: "#32cd32",            linen: "#faf0e6",
		magenta: "#ff00ff",            maroon: "#800000",               mediumaquamarine: "#66cdaa",
		mediumblue: "#0000cd",         mediumorchid: "#ba55d3",         mediumpurple: "#9370d8",
		mediumseagreen: "#3cb371",     mediumslateblue: "#7b68ee",      mediumspringgreen: "#00fa9a",
		mediumturquoise: "#48d1cc",    mediumvioletred: "#c71585",      midnightblue: "#191970",
		mintcream: "#f5fffa",          mistyrose: "#ffe4e1",            moccasin: "#ffe4b5",
		navajowhite: "#ffdead",        navy: "#000080",                 oldlace: "#fdf5e6",
		olive: "#808000",              olivedrab: "#6b8e23",            orange: "#ffa500",
		orangered: "#ff4500",          orchid: "#da70d6",               palegoldenrod: "#eee8aa",
		palegreen: "#98fb98",          paleturquoise: "#afeeee",        palevioletred: "#d87093",
		papayawhip: "#ffefd5",         peachpuff: "#ffdab9",            peru: "#cd853f",
		pink: "#ffc0cb",               plum: "#dda0dd",                 powderblue: "#b0e0e6",
		purple: "#800080",             red: "#ff0000",                  rosybrown: "#bc8f8f",
		royalblue: "#4169e1",          saddlebrown: "#8b4513",          salmon: "#fa8072",
		sandybrown: "#f4a460",         seagreen: "#2e8b57",             seashell: "#fff5ee",
		sienna: "#a0522d",             silver: "#c0c0c0",               skyblue: "#87ceeb",
		slateblue: "#6a5acd",          slategray: "#708090",            snow: "#fffafa",
		springgreen: "#00ff7f",        steelblue: "#4682b4",            tan: "#d2b48c",
		teal: "#008080",               thistle: "#d8bfd8",              tomato: "#ff6347",
		turquoise: "#40e0d0",          violet: "#ee82ee",               violetred: "#d02090",
		wheat: "#f5deb3",              white: "#ffffff",                whitesmoke: "#f5f5f5",
		yellow: "#ffff00",             yellowgreen: "#9acd32"
	};
// @formatter:on

/**
 * Color Name to Hex
 *
 * @param {string} colorName
 * @returns {boolean|*}
 */
function colourNameToHex(colorName) {
	if (typeof colorNames[colorName.toLowerCase()] !== "undefined") {
		return colorNames[colorName.toLowerCase()];
	}
	return false;
}

/**
 * Color Component to Hex
 *
 * @param {number} c
 * @returns {string}
 */
function componentToHex(c) {
	const hex = c.toString(16);
	return hex.length === 1 ? "0" + hex : hex;
}

/**
 * Color RGB to Hex
 *
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {string}
 */
function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * RGB Colour to Hex Converter
 *
 * @param {string} rgbStr - RGB colour string (e.g. "rgb(155, 102, 102)").
 * @returns {string} - Hex Color (e.g. "#9b6666").
 */
function rgb2Hex(rgbStr) {
	const [red, green, blue] = rgbStr.substring(4, rgbStr.length - 1).replace(/ /g, "").split(",");
	let rgb = blue | (green << 8) | (red << 16); // eslint-disable-line no-bitwise
	return "#" + (0x1000000 + rgb).toString(16).slice(1);
}

/**
 * Color Hex to RGB
 *
 * @param {string} hex
 * @returns {*}
 */
function hexToRgb(hex) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

/**
 * Color Hex to X3D RGB
 *
 * @param {string} hex
 * @returns {string}
 */
function hexToX3d(hex) {
	const rgb = hexToRgb(hex);
	return `${rgb.r / 255} ${rgb.g / 255} ${rgb.b / 255}`;
}

/**
 * Color Name to X3D RGB
 *
 * @param {string} colorName
 * @returns {string}
 */
function colourNameToX3d(colorName) {
	const rgb = hexToRgb(colourNameToHex(colorName));
	return `${rgb.r / 255} ${rgb.g / 255} ${rgb.b / 255}`;
}

/**
 * X3D Color Parser
 *
 * @param {Rgb|Hsl|null} color
 * @returns {string}
 */
export function colorParse(color) {
	let red = 0;
	let green = 0;
	let blue = 0;
	let alpha = 0;

	// Already matches X3D RGB
	const x3dMatch = /^(0+\.?\d*|1\.?0*)\s+(0+\.?\d*|1\.?0*)\s+(0+\.?\d*|1\.?0*)$/.exec(color);
	if (x3dMatch !== null) {
		red = +x3dMatch[1];
		green = +x3dMatch[2];
		blue = +x3dMatch[3];
	}

	// Matches CSS rgb() function
	const rgbMatch = /^rgb\((\d{1,3}),\s{0,1}(\d{1,3}),\s{0,1}(\d{1,3})\)$/.exec(color);
	if (rgbMatch !== null) {
		red = rgbMatch[1] / 255.0;
		green = rgbMatch[2] / 255.0;
		blue = rgbMatch[3] / 255.0;
	}

	// Matches CSS color name
	if (colorNames[color]) {
		color = colorNames[color];
	}

	// Hexadecimal color codes
	if (color.substr && color.substr(0, 1) === "#") {
		const hex = color.substr(1);
		const len = hex.length;

		if (len === 8) {
			red = parseInt("0x" + hex.substr(0, 2), 16) / 255.0;
			green = parseInt("0x" + hex.substr(2, 2), 16) / 255.0;
			blue = parseInt("0x" + hex.substr(4, 2), 16) / 255.0;
			alpha = parseInt("0x" + hex.substr(6, 2), 16) / 255.0;
		} else if (len === 6) {
			red = parseInt("0x" + hex.substr(0, 2), 16) / 255.0;
			green = parseInt("0x" + hex.substr(2, 2), 16) / 255.0;
			blue = parseInt("0x" + hex.substr(4, 2), 16) / 255.0;
			alpha = 1.0;
		} else if (len === 4) {
			red = parseInt("0x" + hex.substr(0, 1), 16) / 15.0;
			green = parseInt("0x" + hex.substr(1, 1), 16) / 15.0;
			blue = parseInt("0x" + hex.substr(2, 1), 16) / 15.0;
			alpha = parseInt("0x" + hex.substr(3, 1), 16) / 15.0;
		} else if (len === 3) {
			red = parseInt("0x" + hex.substr(0, 1), 16) / 15.0;
			green = parseInt("0x" + hex.substr(1, 1), 16) / 15.0;
			blue = parseInt("0x" + hex.substr(2, 1), 16) / 15.0;
			alpha = 1.0;
		}
	}

	red = red.toFixed(4);
	green = green.toFixed(4);
	blue = blue.toFixed(4);

	return `${red} ${green} ${blue}`;
}
