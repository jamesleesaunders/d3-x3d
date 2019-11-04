import * as d3 from "d3";

/**
 * Custom Dispatch Events
 *
 * @type {d3.dispatch}
 */
export const dispatch = d3.dispatch("d3X3dClick", "d3X3dMouseOver", "d3X3dMouseOut");

/**
 * Attach Event Listeners to Shape
 *
 * Detect X3DOM events and convert them into D3 dispatch events.
 *
 * @param el
 */
export function attachEventListners(el) {
	el.attr("onclick", "d3.x3d.events.forwardEvent(event);")
		.on("click", function(e) { dispatch.call("d3X3dClick", this, e); });

	el.attr("onmouseover", "d3.x3d.events.forwardEvent(event);")
		.on("mouseover", function(e) { dispatch.call("d3X3dMouseOver", this, e); });

	el.attr("onmouseout", "d3.x3d.events.forwardEvent(event);")
		.on("mouseout", function(e) { dispatch.call("d3X3dMouseOut", this, e); });
}

/**
 * Forward X3DOM Event to D3
 *
 * In X3DOM, it is the canvas which captures onclick events, therefore defining a D3 event handler
 * on an single X3DOM element does not work. A workaround is to define an onclick handler which then
 * forwards the call to the D3 "click" event handler with the event.
 * Note: X3DOM and D3 event members slightly differ, so d3.mouse() function does not work.
 *
 * @param {event} event
 * @see https://bl.ocks.org/hlvoorhees/5376764
 */
export function forwardEvent(event) {
	let type = event.type;
	let target = d3.select(event.target);
	target.on(type)(event);
}

/**
 * Show Alert With Event Coordinate
 *
 * @param {event} event
 * @returns {{canvas: {x: (*|number), y: (*|number)}, world: {x: *, y: *, z: *}, page: {x: number, y: number}}}
 */
export function getEventCoordinates(event) {
	let pagePoint = getEventPagePoint(event);

	return {
		world: { x: event.hitPnt[0], y: event.hitPnt[1], z: event.hitPnt[2] },
		canvas: { x: event.layerX, y: event.layerY },
		page: { x: pagePoint.x, y: pagePoint.y }
	}
}

/**
 * Inverse of coordinate transform defined by function mousePosition(evt) in x3dom.js
 *
 * @param {event} event
 * @returns {{x: number, y: number}}
 */
export function getEventPagePoint(event) {
	let pageX = -1;
	let pageY = -1;

	let convertPoint = window.webkitConvertPointFromPageToNode;

	if ("getBoundingClientRect" in document.documentElement) {
		let holder = getX3domHolder(event);
		let computedStyle = document.defaultView.getComputedStyle(holder, null);
		let paddingLeft = parseFloat(computedStyle.getPropertyValue("padding-left"));
		let borderLeftWidth = parseFloat(computedStyle.getPropertyValue("border-left-width"));
		let paddingTop = parseFloat(computedStyle.getPropertyValue("padding-top"));
		let borderTopWidth = parseFloat(computedStyle.getPropertyValue("border-top-width"));
		let box = holder.getBoundingClientRect();
		let scrolLeft = window.pageXOffset || document.body.scrollLeft;
		let scrollTop = window.pageYOffset || document.body.scrollTop;
		pageX = Math.round(event.layerX + (box.left + paddingLeft + borderLeftWidth + scrolLeft));
		pageY = Math.round(event.layerY + (box.top + paddingTop + borderTopWidth + scrollTop));
	} else if (convertPoint) {
		let pagePoint = convertPoint(event.target, new WebKitPoint(0, 0));
		pageX = Math.round(pagePoint.x);
		pageY = Math.round(pagePoint.y);
	} else {
		x3dom.debug.logError("Unable to find getBoundingClientRect or webkitConvertPointFromPageToNode");
	}

	return { x: pageX, y: pageY };
}

/**
 * Return the x3d Parent Holder
 *
 * Find clicked element, walk up DOM until we find the parent x3d.
 * Then return the x3d's parent.
 *
 * @param event
 * @returns {*}
 */
export function getX3domHolder(event) {
	let target = d3.select(event.target);

	let x3d = target.select(function() {
		let el = this;
		while (el.nodeName.toLowerCase() !== "x3d") {
			el = el.parentElement;
		}

		return el;
	});

	return x3d.select(function() {
		return this.parentNode;
	}).node();
}
