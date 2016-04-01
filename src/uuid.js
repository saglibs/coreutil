var C = {};

C.uuid = function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
};

C.fastUuid = function() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid[i] = '-';
        } else if (i === 14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
};

module.exports = C;