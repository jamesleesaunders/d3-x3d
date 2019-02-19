import * as d3 from "d3";

let dispatch = d3.dispatch("customMouseOver", "customMouseOut", "customClick");

/**
 * @see https://bl.ocks.org/hlvoorhees/5376764
 *
 * The x3dom canvas captures onclick events, so just defining a 3d event handler on an x3dom element does not work.
 * Hence, clicking the red cube does nothing.
 * A workaround is to define an onclick handler which calls the 3d 'click' event handler with the event, as
 * demonstrated by clicking on the blue sphere. Note that x3dom event members differ from d3's, so d3.mouse()
 * function does not work.
 */
export function forwardMouseClick(event) {
	let target = d3.select(event.target);
	target.on('click')(event);
}

export function forwardMouseOver(event) {
	let target = d3.select(event.target);
	target.on('mouseover')(event);
}

export function forwardMouseOut(event) {
	let target = d3.select(event.target);
	target.on('mouseout')(event);
}
