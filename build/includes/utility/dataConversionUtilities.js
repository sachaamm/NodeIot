"use strict";

function intFromBytes(x) {
    var val = 0;
    for (var i = 0; i < x.length; ++i) {
        val += x[i];
        if (i < x.length - 1) {
            val = val << 8;
        }
    }
    return val;
}