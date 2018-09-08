import * as d3 from "d3";

/**
 * Data Analysis
 *
 */
export default function(data) {

  const STRUCTURE_ROW = 1;
  const STRUCTURE_ROWS = 2;

  /**
   * Row or Rows?
   */
  let dataStructure = (function() {
    if (data["key"] !== undefined) {
      return STRUCTURE_ROW;
    } else {
      return STRUCTURE_ROWS;
    }
  })();

  /**
   * Row Key
   */
  let rowKey = (function() {
    let ret;
    if (STRUCTURE_ROW === dataStructure) {
      ret = d3.values(data)[0];
    }

    return ret;
  })();

  /**
   * Row Keys
   */
  let rowKeys = (function() {
    let ret;
    if (STRUCTURE_ROWS === dataStructure) {
      ret = data.map(function(d) {
        return d.key;
      });
    }

    return ret;
  })();

  /**
   * Row Totals
   */
  let rowTotals = (function() {
    let ret;
    if (STRUCTURE_ROWS === dataStructure) {
      ret = {};
      d3.map(data).values().forEach(function(d) {
        let rowKey = d.key;
        d.values.forEach(function(d) {
          ret[rowKey] = (typeof(ret[rowKey]) === "undefined" ? 0 : ret[rowKey]);
          ret[rowKey] += d.value;
        });
      });
    }

    return ret;
  })();

  /**
   * Row Totals Max
   */
  let rowTotalsMax = (function() {
    let ret;
    if (STRUCTURE_ROWS === dataStructure) {
      ret = d3.max(d3.values(rowTotals));
    }

    return ret;
  })();

  /**
   * Join two arrays
   */
  let union = function(array1, array2) {
    let ret = [];
    let arr = array1.concat(array2);
    let len = arr.length;
    let assoc = {};

    while (len--) {
      let item = arr[len];

      if (!assoc[item]) {
        ret.unshift(item);
        assoc[item] = true;
      }
    }

    return ret;
  };

  /**
   * Column Keys
   */
  let columnKeys = (function() {
    let ret = [];
    if (STRUCTURE_ROW === dataStructure) {
      ret = d3.values(data.values).map(function(d) {
        return d.key;
      });

    } else {
      d3.map(data).values().forEach(function(d) {
        let tmp = [];
        d.values.forEach(function(d, i) {
          tmp[i] = d.key;
        });

        ret = union(tmp, ret);
      });
    }

    return ret;
  })();

  /**
   * Row Totals
   */
  let rowTotal = (function() {
    let ret;
    if (STRUCTURE_ROW === dataStructure) {
      ret = d3.sum(data.values, function(d) {
        return d.value;
      });
    }

    return ret;
  })();

  /**
   * Column Totals
   */
  let columnTotals = (function() {
    let ret;
    if (STRUCTURE_ROWS === dataStructure) {
      ret = {};
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          let columnName = d.key;
          ret[columnName] = (typeof(ret[columnName]) === "undefined" ? 0 : ret[columnName]);
          ret[columnName] += d.value;
        });
      });
    }

    return ret;
  })();

  /**
   * Column Totals Max
   */
  let columnTotalsMax = (function() {
    let ret;
    if (STRUCTURE_ROWS === dataStructure) {
      ret = d3.max(d3.values(columnTotals));
    }

    return ret;
  })();

  /**
   * Min Value
   */
  let minValue = (function() {
    let ret;
    if (STRUCTURE_ROW === dataStructure) {
      ret = d3.min(data.values, function(d) {
        return +d.value;
      });
    } else {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? d.value : d3.min([ret, +d.value]));
        });
      });
    }

    return +ret;
  })();

  /**
   * Max Value
   */
  let maxValue = (function() {
    let ret;
    if (STRUCTURE_ROW === dataStructure) {
      ret = d3.max(data.values, function(d) {
        return +d.value;
      });

    } else {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = (typeof(ret) === "undefined" ? d.value : d3.max([ret, +d.value]));
        });
      });
    }

    return +ret;
  })();

  /**
   * How many decimal places?
   */
  let decimalPlaces = function(num) {
    let match = ("" + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
      return 0;
    }

    return Math.max(
      0,
      // Number of digits right of decimal point.
      (match[1] ? match[1].length : 0)
      // Adjust for scientific notation.
      -
      (match[2] ? +match[2] : 0));
  };

  /**
   * Max decimal place
   */
  let maxDecimalPlace = (function() {
    let ret = 0;
    if (STRUCTURE_ROWS === dataStructure) {
      d3.map(data).values().forEach(function(d) {
        d.values.forEach(function(d) {
          ret = d3.max([ret, decimalPlaces(d.value)])
        });
      });
    }

    return ret;
  })();

  // If thresholds values are not already set attempt to auto-calculate some thresholds
  let thresholds = (function() {
    let distance = maxValue - minValue;

    return [
      +(minValue + (0.15 * distance)).toFixed(maxDecimalPlace),
      +(minValue + (0.40 * distance)).toFixed(maxDecimalPlace),
      +(minValue + (0.55 * distance)).toFixed(maxDecimalPlace),
      +(minValue + (0.90 * distance)).toFixed(maxDecimalPlace)
    ];
  })();

  /**
   * Rotate Data
   */
  let rotate = function() {
    let columnKeys = data.map(function(d) {
      return d.key;
    });

    let rowKeys = data[0].values.map(function(d) {
      return d.key
    });

    let rotated = rowKeys.map(function(k, i) {
      let values = [];
      for (let j = 0; j <= data.length - 1; j++) {
        values[j] = {
          key: columnKeys[j],
          value: data[j].values[i].value
        };
      }

      return {
        key: k,
        values: values
      }
    });

    return rotated;
  };

  /**
   * Summary
   */
  let summary = function() {
    return {
      levels: dataStructure,
      rowKey: rowKey,
      rowTotal: rowTotal,
      rowKeys: rowKeys,
      rowTotals: rowTotals,
      rowTotalsMax: rowTotalsMax,
      columnKeys: columnKeys,
      columnTotals: columnTotals,
      columnTotalsMax: columnTotalsMax,
      minValue: minValue,
      maxValue: maxValue,
      maxDecimalPlace: maxDecimalPlace,
      thresholds: thresholds
    }
  };

  return {
    summary: summary,
    rotate: rotate
  };
}
