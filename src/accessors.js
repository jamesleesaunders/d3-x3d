/**
 * D3-style getter / setter methods.
 *
 * For each key of `state`, calling `my[key]()` returns the current value.
 * Calling `my[key](value)` writes that value and returns `my`.
 *
 * @module
 * @param {Function} my - Component or chart function.
 * @param {Object} state - Per-instance values. Keys become method names.
 * @returns {Function} The same component or chart function.
 */
export function attachAccessors(my, state) {
	Object.keys(state).forEach((key) => {
		my[key] = function(_v) {
			if (!arguments.length) return state[key];
			state[key] = _v;
			return my;
		};
	});

	return my;
}
