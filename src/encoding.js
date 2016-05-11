/*
 * String Encoding
 * Binary Operation
 * String Convertion
 */
var ES = {};

/*
 * Possible input
 *
 * 1 ArrayBuffer of raw data bytes
 * 2 Array of raw data bytes
 * 3 Array of char codes (UTF-16)
 * 4 Raw data string
 * 5 Unicode String
 *
 * Possible output
 *
 * 1 ArrayBuffer of raw data bytes
 * 2 Array of raw data bytes
 * 3 Array of char codes (UTF-16)
 * 4 String of raw data
 * 5 Unicode String
 */

var B10000000 = 0x80;
var B11000000 = 0xC0;
var B11100000 = 0xE0;
var B11110000 = 0xF0;
var B11111000 = 0xF8;
var B11111100 = 0xFC;
//noinspection JSUnusedLocalSymbols
var B11111110 = 0xFE;
var B00000001 = 0x01;
var B00000011 = 0x03;
var B00000111 = 0x07;
var B00001111 = 0x0F;
var B00011111 = 0x1F;
var B00111111 = 0x3F;
//noinspection JSUnusedLocalSymbols
var B01111111 = 0x7F;
var B11111111 = 0xFF;

/*
 * Used for ArrayBuffer extension
 */
//function allocByteArray(length, isBuffer) {
//    if (isBuffer) {
//        return new Int8Array(length);
//    } else {
//        return new Array(length);
//    }
//}
//
//function allocIntArray(length, isBuffer) {
//    if (isBuffer) {
//        return new Int32Array(length);
//    } else {
//        return new Array(length);
//    }
//}

/**
 * Unicode Int Array -> Unicode String
 *
 * @static
 * @memberof H
 * @param {Array|ArrayBuffer|Uint8Array} ar unicode int array or arraybuffer
 * @returns {string} unicode string
 */
function unicodeIntArrayToString(ar) {
    if (ar instanceof ArrayBuffer) {
        ar = new Uint8Array(ar);
    }
    var result = "";
    var l = ar.byteLength || ar.length;
    var length = ar.byteLength || ar.length;
    for (l += 1; --l;) {
        result += String.fromCharCode(ar[length - l]);
    }
    return result;
}

/**
 * Unicode String -> Unicode Int Array
 *
 * @static
 * @memberof H
 * @param {String} str unicode string (including ascii string)
 * @returns {Array} unicode int array
 */
function stringToUnicodeIntArray(str) {
    var length = str.length;
    var result = new Array(length);
    for (length += 1; --length;) {
        result[length - 1] = str.charCodeAt(length - 1);
    }
    return result;
}

/**
 * Utf16 String -> Byte Array (represented in UTF-8)
 *
 * @static
 * @memberof H
 * @param {String} str unicode string
 * @returns {Array} utf-8 byte array
 */
function stringToUtf8ByteArray(str) {
    var out = [], l = str.length;
    var n = str.length;
    for (l++; --l;) {
        var i = n - l;
        var c = str.charCodeAt(i);
        if (c < 0x80) {
            out[out.length] = c;
        } else if (c < 0x800) {
            out[out.length] = 0xc0 | (c >> 6);
            out[out.length] = 0x80 | (c & 0x3f);
        } else if (c < 0xd800 || c >= 0xe000) {
            out[out.length] = 0xe0 | (c >> 12);
            out[out.length] = 0x80 | ((c >> 6) & 0x3f);
            out[out.length] = 0x80 | (c & 0x3f);
        } else {
            // surrogate pair
            --l;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            c = 0x10000 + (((c & 0x3ff) << 10)
                | (str.charCodeAt(i) & 0x3ff));
            out[out.length] = 0xf0 | (c >> 18);
            out[out.length] = 0x80 | ((c >> 12) & 0x3f);
            out[out.length] = 0x80 | ((c >> 6) & 0x3f);
            out[out.length] = 0x80 | (c & 0x3f);
        }
    }
    return out;
}

/**
 * Utf16 String -> ArrayBuffer (Uint8Array) representing UTF-8
 *
 * @static
 * @memberof H
 * @param {String} str utf-16 string
 * @return {Uint8Array} utf-8 arraybuffer
 */
function stringToArrayBuffer(str) {
    var byteLength = str.length * 3;
    var isString = typeof str == 'string';
    var out = new Uint8Array(byteLength);
    var pc = 0;
    for (var i = 0; i < str.length; i++) {
        var c = isString ? str.charCodeAt(i) : str[i];
        if (c < 0x80) {
            out[out.length] = c;
            pc++;
        } else if (c < 0x800) {
            out[out.length] = 0xc0 | (c >> 6);
            out[out.length] = 0x80 | (c & 0x3f);
            pc += 2;
        } else if (c < 0xd800 || c >= 0xe000) {
            out[out.length] = 0xe0 | (c >> 12);
            out[out.length] = 0x80 | ((c >> 6) & 0x3f);
            out[out.length] = 0x80 | (c & 0x3f);
            pc += 3;
        } else {
            // surrogate pair
            --l;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            c = 0x10000 + (((c & 0x3ff)<<10) | (c & 0x3ff));
            out[out.length] = 0xf0 | (c >> 18);
            out[out.length] = 0x80 | ((c >> 12) & 0x3f);
            out[out.length] = 0x80 | ((c >> 6) & 0x3f);
            out[out.length] = 0x80 | (c & 0x3f);
            pc += 4;
        }
    }
    if (ArrayBuffer.prototype.slice) {
        return out.slice(0, pc);
    } else {
        var output = new Uint8Array(pc);
        for (var j = 0; j < pc; j++) {
            output[j] = out[j];
        }
        return output;
    }
}

/**
 * Utf16 Array -> ArrayBuffer (Uint8Array) (in UTF-8)
 * @type {stringToArrayBuffer}
 */
var utf16ArrayToArrayBuffer = stringToArrayBuffer;

/**
 * Byte Array (UTF-8) -> Unicode String
 * Uint8Array (UTF-8) -> Unicode String **bug here**
 *
 * @static
 * @memberof H
 * @param {Array|ArrayBuffer|Uint8Array} data byte array or uint8array in UTF-8 encoding
 * @returns {string} unicode string
 */
function utf8ByteArrayToUnicodeString(data) { // array of bytes
    if (data instanceof ArrayBuffer) {
        data = new Uint8Array(data);
    }
    var str = '',
        i, l = data.byteLength || data.length, s = data.byteLength || data.length;

    for (l++; --l;) {
        i = s - l;
        if (l < 0) break;
        var value = data[i];

        //accept Unicode char code also
        if (value < 0x80 || value > 0xFF) {
            str += String.fromCharCode(value);
        } else if (value > 0xBF && value < 0xE0) {
            str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
            --l;
        } else if (value > 0xDF && value < 0xF0) {
            str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
            l -= 2;
        } else if (value < 0x100) {
            // surrogate pair
            var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

            str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
            l -= 3;
        }
    }

    return str;
}

/**
 * Byte Array (UTF-8 representation) -> Int Array (UTF-16 representation)
 * Uint8Array (UTF-8 representation) -> Int Array (UTF-16 representation)
 *
 * @static
 * @memberof H
 * @param {Array|Uint8Array|ArrayBuffer} arr byte array in UTF-8 encoding
 * @return {Array} utf-16 int array
 */
function byteArrayToUtf16Array(arr) {
    var used = 0;
    var l;
    var length = l = (arr.byteLength || arr.length), i, t, byteCount, rev;
    for (l += 1;--l;) {
        rev = 0;
        i = length - l;
        t = arr[i];
        if (t < B10000000) {
            byteCount = 0;
            rev = B11111111;
        } else if (t < B11000000) {
            //will not happen
            byteCount = 0;
            rev = B11111111;
        } else if (t < B11100000) {
            //U-00000080 - U-000007FF: 110xxxxx 10xxxxxx
            byteCount = 1;
            rev = B00011111;
        } else if (t < B11110000) {
            //U-00000800 - U-0000FFFF: 1110xxxx 10xxxxxx 10xxxxxx
            byteCount = 2;
            rev = B00001111;
        } else if (t < B11111000) {
            //U-00010000 - U-001FFFFF: 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            byteCount = 3;
            rev = B00000111;
        }
        //NOTE: 4 and 5 are not safe, cuz `<<` operation is over 32bit (int)
        //NOTE: javascript byte operations use int(32bit)
        else if (t < B11111100) {
            //U-00200000 - U-03FFFFFF: 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            byteCount = 4;
            rev = B00000011;
        } else {
            //U-04000000 - U-7FFFFFFF: 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            byteCount = 5;
            rev = B00000001;
        }

        var allc = byteCount;
        var result = 0;
        if (byteCount) {
            for (byteCount += 1; --byteCount;) {
                //byteCount: bc -> 1
                result += ((arr[i + byteCount] & B00111111) << (6 * (allc - byteCount)));
            }
        }
        result |= (t & rev) << (allc * 6);
        arr[used++] = result;
        l -= allc;
        if (l <= 0) {
            break;
        }
    }
    arr.length = used;
    return arr;
}

/**
 * UTF-16 Int Array -> Byte Array (representing UTF-8 chars)
 *
 * @static
 * @memberof H
 * @param {Array} ia utf-16 int array
 * @returns {Array} utf-8 byte array
 */
function utf16ArrayToByteArray(ia) {
    var out = [];
    for (var i = 0; i < ia.length; i++) {
        var c = ia[i];
        if (c < 0x80) {
            out[out.length] = c;
        } else if (c < 0x800) {
            out[out.length] = 0xc0 | (c >> 6);
            out[out.length] = 0x80 | (c & 0x3f);
        } else if (c < 0xd800 || c >= 0xe000) {
            out[out.length] = 0xe0 | (c >> 12);
            out[out.length] = 0x80 | ((c >> 6) & 0x3f);
            out[out.length] = 0x80 | (c & 0x3f);
        } else {
            // surrogate pair
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            c = 0x10000 + (((c & 0x3ff) << 10)
                | (ia[i] & 0x3ff));
            out[out.length] = 0xf0 | (c >> 18);
            out[out.length] = 0x80 | ((c >> 12) & 0x3f);
            out[out.length] = 0x80 | ((c >> 6) & 0x3f);
            out[out.length] = 0x80 | (c & 0x3f);
            i++;
        }
    }
    return out;
}

/**
 * ASCII String of UTF-8 Byte Array -> Unicode String
 *
 * @static
 * @memberof H
 * @param {String} str ascii string of utf-8 byte array
 * @returns {string} unicode string in utf-16 encoding
 */
function utf8ByteStringToUnicodeString(str) {
    //bs -> ba
    //ba -> us
    return utf8ByteArrayToUnicodeString(stringToUnicodeIntArray(str));
}

/**
 * Unicode String -> ASCII String of UTF-8 Byte Array
 *
 * @static
 * @memberof H
 * @param {String} str unicode string
 * @return {String} ascii string of utf-8 encoded byte array
 */
function unicodeStringToUtf8ByteString(str) {
    //us -> ba
    //ba -> s
    return unicodeIntArrayToString(stringToUtf8ByteArray(str));
}

/**
 * Raw String (UTF-8 Bytes) -> Uint8Array
 * no validality check
 *
 * @static
 * @memberof H
 * @param {String} str ascii string in utf-8 encoding
 * @return {Uint8Array} result arraybuffer
 */
function utf8ByteStringToUint8Array(str) {
    var length = str.length;
    var out = new Uint8Array(length);
    for (var i = 0; i < length; i++) {
        out[i] = str.charCodeAt(i);
    }
    return out;
}

/*
 * `Binary String` is the binary representation of a number
 */

/**
 * Decimal String -> Binary String
 *
 * @static
 * @memberof H
 * @param {String} d string of decimal number
 * @returns {string} string of binary representation of the specific number
 */
function numberToBinaryString(d) {
    return Number(d).toString(2);
}

//noinspection JSUnusedLocalSymbols
/**
 * String (might be byte string) -> Unicode string
 * but much (1x) slower than E.ba2s(E.s2a())
 *
 * @private
 * @deprecated
 * @param {String} str unicode string
 * @returns {string} utf8 string
 */
function strintToUtf8String(str) {
    //noinspection JSDeprecatedSymbols
    return decodeURIComponent(escape(str));
}

function hex(i) {
    if (!i) return "??";
    return ("00" + (i & 0xff).toString(16)).slice(-2);
}

/**
 * Get a well-printed JSON string
 *
 * @static
 * @memberof H
 * @param {Object} jsonObject json object to encode
 */
ES.getPrettyJson = function(jsonObject) {
    return JSON.stringify(jsonObject, null, "\t");
};

/**
 * Alias of H.numberToBinaryString
 *
 * @static
 * @memberof H
 * @type {H.numberToBinaryString}
 */
ES.n2bin = numberToBinaryString;
/**
 * Get the hex representation string of a number (less than 256/0xFF)
 *
 * @static
 * @memberof H
 * @param {Number} i
 * @returns {String} hex string
 */
ES.hex = hex;

//3-5, 5-3; 3-4, 4-3; 1-4
//Array of charcode <-> Unicode String
/**
 * ArrayBuffer to ByteString
 * UnicodeIntArray to UnicodeString
 *
 * @static
 * @memberof H
 * @type {H.unicodeIntArrayToString}
 */
ES.ab2bs = ES.ua2s = unicodeIntArrayToString;
/**
 * UnicodeString to UnicodeIntArray
 *
 * @static
 * @memberof H
 * @type {H.stringToUnicodeIntArray}
 */
ES.s2ua = stringToUnicodeIntArray;

//4-5, 5-4
//Raw data string <-> Unicode String
/**
 * UnicodeString to AsciiByteString
 *
 * @static
 * @memberof H
 * @type {H.unicodeStringToUtf8ByteString}
 */
ES.us2bs = unicodeStringToUtf8ByteString;
/**
 * Utf-8 ByteString to UnicodeString
 * @type {H.utf8ByteStringToUnicodeString}
 */
ES.bs2us = utf8ByteStringToUnicodeString;

//2-5, 5-2; 2-4, 4-2; ?, 1-5
//Unicode String <-> Array of raw data bytes
/**
 * Unicode String to ByteArray
 *
 * @static
 * @memberof H
 * @type {H.stringToUtf8ByteArray}
 */
ES.s2ba = stringToUtf8ByteArray; //str to binary arr (utf8)
/**
 * ByteArray to UnicodeString
 * ArrayBuffer to UnicodeString
 *
 * @static
 * @memberof H
 * @type {H.utf8ByteArrayToUnicodeString}
 */
ES.ab2s = ES.ba2s = utf8ByteArrayToUnicodeString; //binary arr (utf8) to str

//2-3, 3-2; 1-3
/**
 * ByteArray to Utf16IntArray
 *
 * @static
 * @memberof H
 * @type {H.byteArrayToUtf16Array}
 */
ES.ba2ia = byteArrayToUtf16Array; //binary array to int array
/**
 * Utf16IntArray to ByteArray
 *
 * @static
 * @memberof H
 * @type {H.utf16ArrayToByteArray}
 */
ES.ia2ba = utf16ArrayToByteArray;

//meaningless: 1-2, 2-1

//4-1
/**
 * AsciiByteString to ArrayBuffer
 *
 * @static
 * @memberof H
 * @type {H.utf8ByteStringToUint8Array}
 */
ES.bs2ab = utf8ByteStringToUint8Array;
//5-1
/**
 * UnicodeString to ArrayBuffer(Uint8Array)
 *
 * @static
 * @memberof H
 * @type {H.stringToArrayBuffer}
 */
ES.s2ab = stringToArrayBuffer;
//3-1
/**
 * IntArray to ArrayBuffer
 *
 * @static
 * @memberof H
 * @type {stringToArrayBuffer}
 */
ES.a2ab = utf16ArrayToArrayBuffer;

//aliases
/**
 * Unicode CharArray to String, alias of H.ua2s
 *
 * @static
 * @memberof H
 * @type {*|unicodeIntArrayToString}
 */
ES.a2s = ES.ua2s; //unicode char array to str
/**
 * UnicodeString to UnicodeIntArray
 *
 * @static
 * @memberof H
 * @type {*|stringToUnicodeIntArray}
 */
ES.s2a = ES.s2ua; //str to unicode char array

/**
 * ByteArray to UnicodeIntArray, alias of E.ba2ia
 * @type {*|byteArrayToUtf16Array}
 */
ES.ba2ua = ES.ba2ia; //alias

/**
 * String to UnicodeString
 *
 * @static
 * @memberof H|E
 * @type {H.utf8ByteStringToUnicodeString}
 */
ES.s2us = ES.bs2us;

module.exports = ES;
