
var obj = {a: 1};
H.addProperty(obj, '__Module__', {
    value: '__isRS__',
    configurable: false,
    enumerable: false,
    writable: true
});

QUnit.test("toArray Test", function(assert) {
    var arr = obj.toArray();
    assert.ok(arr !== undefined && arr[0] === 1 && arr.length === 1,
        "{a:1}.toArray() === [1] Passed!");
});