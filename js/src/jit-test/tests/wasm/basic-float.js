load(libdir + "wasm.js");

if (!wasmIsSupported())
    quit();

function mismatchError(actual, expect) {
    var str = "type mismatch: expression has type " + actual + " but expected " + expect;
    return RegExp(str);
}

function testBinary(type, opcode, lhs, rhs, expect) {
  assertEq(wasmEvalText('(module (func (param ' + type + ') (param ' + type + ') (result ' + type + ') (' + type + '.' + opcode + ' (get_local 0) (get_local 1))) (export "" 0))')(lhs, rhs), expect);
}

testBinary('f32', 'add', 40, 2, 42);
testBinary('f32', 'sub', 40, 2, 38);
testBinary('f32', 'mul', 40, 2, 80);
testBinary('f32', 'div', 40, 3, 13.333333015441895);
//testBinary('f32', 'min', 40, 2, 2); // TODO: NYI
//testBinary('f32', 'max', 40, 2, 40); // TODO: NYI
//testBinary('f32', 'copysign', 40, -2, -40); // TODO: NYI

testBinary('f64', 'add', 40, 2, 42);
testBinary('f64', 'sub', 40, 2, 38);
testBinary('f64', 'mul', 40, 2, 80);
testBinary('f64', 'div', 40, 3, 13.333333333333334);
//testBinary('f64', 'min', 40, 2, 2); // TODO: NYI
//testBinary('f64', 'max', 40, 2, 40); // TODO: NYI
//testBinary('f64', 'copysign', 40, -2, -40); // TODO: NYI

assertErrorMessage(() => wasmEvalText('(module (func (param i32) (param f32) (result f32) (f32.add (get_local 0) (get_local 1))))'), TypeError, mismatchError("i32", "f32"));
assertErrorMessage(() => wasmEvalText('(module (func (param f32) (param i32) (result f32) (f32.add (get_local 0) (get_local 1))))'), TypeError, mismatchError("i32", "f32"));
assertErrorMessage(() => wasmEvalText('(module (func (param f32) (param f32) (result i32) (f32.add (get_local 0) (get_local 1))))'), TypeError, mismatchError("f32", "i32"));
assertErrorMessage(() => wasmEvalText('(module (func (param i32) (param f64) (result f64) (f64.add (get_local 0) (get_local 1))))'), TypeError, mismatchError("i32", "f64"));
assertErrorMessage(() => wasmEvalText('(module (func (param f64) (param i32) (result f64) (f64.add (get_local 0) (get_local 1))))'), TypeError, mismatchError("i32", "f64"));
assertErrorMessage(() => wasmEvalText('(module (func (param f64) (param f64) (result i32) (f64.add (get_local 0) (get_local 1))))'), TypeError, mismatchError("f64", "i32"));
