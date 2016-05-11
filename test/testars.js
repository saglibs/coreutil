var id = {
    value: '__isRS__',
    configurable: false,
    enumerable: false,
    writable: true
};

var obj = {a: 1};
var arr = [[1, [2]], 3];
H.addProperty(obj, '__Module__', id);
H.addProperty(arr, '__Module__', id);

QUnit.test("toArray Test", function(assert) {
    var arr = obj.toArray();
    assert.ok(arr !== undefined && arr[0] === 1 && arr.length === 1,
        "{a:1}.toArray() === [1] Passed!");
});

QUnit.test("flatten Test", function(assert) {
    var f = arr.flatten();
    assert.ok(f !== undefined && f[0] === 1 && f.length === 3,
        "[[1, [2]], 3].flatten() === [1,2,3] Passed!");
});