QUnit.test("H.each Test", function(assert) {
    var arr = H.each([1,2,3], function(i) {return i + 1;});
    assert.ok(arr
        && arr.length === 3
        && arr[0] === 2
        && arr[1] === 3
        && arr[2] === 4, "H.each([1,2,3], (i)=>{i + 1}) === [2,3,4] Passed!");
});