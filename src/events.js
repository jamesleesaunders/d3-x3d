import * as d3 from "d3";

const dispatch = d3.dispatch("d3X3domClick", "d3X3domMouseOver", "d3X3domMouseOut");

/**
 * Forward X3DOM Event to D3
 *
 * In X3DOM, it is the canvas which captures onclick events, therefore defining a D3 event handler
 * on an single X3DOM element does not work. A workaround is to define an onclick handler which then
 * forwards the call to the D3 'click' event handler with the event.
 * Note: X3DOM and D3 event members slightly differ, so d3.mouse() function does not work.
 *
 * @param event
 * @see https://bl.ocks.org/hlvoorhees/5376764
 */
export function forwardEvent(event) {
	let type = event.type;
	let target = d3.select(event.target);
	let data = target.datum();
	target.on(type)(data);
}

/**
 * Show Alert With Event Coordinate
 *
 * @param event
 */
export function showAlertWithEventCoordinate(event) {
	let pagePt = invertMousePosition(event);
	window.alert(d3.select(event.target).attr('id') + ' picked at:\n'
		+ 'world coordinate (' + event.hitPnt + '),\n'
		+ 'canvas coordinate (' + event.layerX + ', ' + event.layerY + '),\n'
		+ 'page coordinate (' + pagePt.x + ', ' + pagePt.y + ')');
}

/**
 * Inverse of coordinate transform defined by function mousePosition(evt) in x3dom.js
 *
 * @param event
 * @returns {{x: number, y: number}}
 */
export function invertMousePosition(event) {
	let pageX = -1;
	let pageY = -1;

	let convertPoint = window.webkitConvertPointFromPageToNode;

	if ("getBoundingClientRect" in document.documentElement) {
		let elem = d3.select('#chartholder').node();
		console.log('elem:', elem);
		let box = elem.getBoundingClientRect();
		let scrolleft = window.pageXOffset || document.body.scrollLeft;
		let scrolltop = window.pageYOffset || document.body.scrollTop;
		let paddingLeft = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('padding-left'));
		let borderLeftWidth = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('border-left-width'));
		let paddingTop = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('padding-top'));
		let borderTopWidth = parseFloat(document.defaultView.getComputedStyle(elem, null).getPropertyValue('border-top-width'));
		pageX = Math.round(event.layerX + (box.left + paddingLeft + borderLeftWidth + scrolleft));
		pageY = Math.round(event.layerY + (box.top + paddingTop + borderTopWidth + scrolltop));
	} else if (convertPoint) {
		let pagePoint = convertPoint(event.target, new WebKitPoint(0, 0));
		pageX = Math.round(pagePoint.x);
		pageY = Math.round(pagePoint.y);
	} else {
		x3dom.debug.logError('NO getBoundingClientRect, NO webkitConvertPointFromPageToNode');
	}

	return { x: pageX, y: pageY };
}
