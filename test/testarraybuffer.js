QUnit.test("readFloat32 Test", function(assert) {
    assert.ok(H.readFloat32(new Uint8Array(16)) === 0, "Passed!");
});