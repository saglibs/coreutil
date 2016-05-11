var A = {};

/**
 * Reads a 32bit integer from the specific offset in a Uint8Array (big or little endian)
 *
 * @static
 * @memberof H
 * @param {Uint8Array} byteView uint8array object
 * @param {Number} [offset] byte offset
 * @param {boolean} [littleEndian] flag of is or is not little endian
 * @returns {Number}
 * @example
 *
 * H.readInt32(uint8, 0, 1)
 */
A.readInt32 = function(byteView, offset, littleEndian) {
    var a0, a1, a2, a3;
    a0 = byteView[offset];
    a1 = byteView[offset + 1];
    a2 = byteView[offset + 2];
    a3 = byteView[offset + 3];
    if (littleEndian) {
        a3 = (a3 << 24) >>> 0;
        a2 = a2 << 16;
        a1 = a1 << 8;
    } else {
        a0 = (a0 << 24) >>> 0;
        a1 = a1 << 16;
        a2 = a2 << 8;
    }
    return a3 + a2 + a1 + a0;
};

/**
 * Reads a 16bit integer from the specific offset in a Uint8Array (big or little endian)
 *
 * @static
 * @memberof H
 * @param {Uint8Array} byteView uint8array object
 * @param {Number} [offset] byte offset
 * @param {boolean} [littleEndian] flag of is or is not little endian
 * @returns {Number}
 * @example
 *
 * H.readInt16(uint8, 0, 1)
 */
A.readInt16 = function(byteView, offset, littleEndian) {
    var a0, a1;
    a0 = byteView[offset];
    a1 = byteView[offset + 1];
    if (littleEndian) {
        a1 = a1 << 8;
    } else {
        a0 = a0 << 8
    }
    return a0 + a1;
};

var native = new Int8Array(new Int16Array([1]).buffer)[0] == 1;
/**
 * Reads a 32bit float from the specific offset in a Uint8Array (big or little endian)
 *
 * @static
 * @memberof H
 * @param {Uint8Array} byteView uint8array object
 * @param {Number} [offset] byte offset
 * @param {boolean} [littleEndian] flag of is or is not little endian
 * @returns {Number}
 * @example
 *
 * H.readFloat32(uint8, 0, 1)
 */
A.readFloat32 = function(byteView, offset, littleEndian) {
    var b0, b1, b2, b3, tb1;
    var sign, exponent, mantissa;
    if (littleEndian === undefined) littleEndian = native;

    if (littleEndian) {
        b0 = byteView[offset + 3];
        b1 = byteView[offset + 2];
        b2 = byteView[offset + 1];
        b3 = byteView[offset];
    } else {
        b0 = byteView[offset];
        b1 = byteView[offset + 1];
        b2 = byteView[offset + 2];
        b3 = byteView[offset + 3];
    }

    //to prevent gc
    tb1 = b0 >> 7;
    sign = 1 - (2 * tb1);

    b0 = b0 << 1;
    tb1 = b1 >> 7;
    b0 = (b0 & 0xff);
    exponent = (b0 | tb1) - 127;

    tb1 = b1 & 0x7f;
    tb1 = tb1 << 16;
    b2 = b2 << 8;
    mantissa = tb1 | b2 | b3;

    if (exponent === 128) {
        if (mantissa !== 0) {
            return NaN;
        } else {
            return sign * Infinity;
        }
    }

    if (exponent === -127) { // Denormalized
        return sign * mantissa * Math.pow(2, -126 - 23);
    }

    return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
};

module.exports = A;
