const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

const source = fs.readFileSync(require.resolve('../src/lib/booking-date.ts'), 'utf8');
const scope = { exports: {}, Date };
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, scope);
const { bookingDate, isValidBookingDate } = scope.exports;

test('uses the local calendar near midnight and across year boundaries', () => {
  assert.equal(bookingDate(0, new Date(2026, 10, 18, 0, 15)), '2026-11-18');
  assert.equal(bookingDate(0, new Date(2026, 10, 18, 23, 45)), '2026-11-18');
  assert.equal(bookingDate(1, new Date(2026, 11, 31, 23, 45)), '2027-01-01');
  assert.equal(bookingDate(1, new Date(2026, 2, 7, 12)), '2026-03-08');
});

test('accepts today and future dates and rejects empty, malformed, impossible, and past dates', () => {
  const now = new Date(2026, 10, 18, 12);
  for (const value of ['2026-11-18', '2026-11-19', '2028-02-29']) {
    assert.equal(isValidBookingDate(value, now), true, value);
  }
  for (const value of ['', '2026-11-17', '2027-02-29', '2026-11-31', '2026-13-01', '2026-00-01', '2026-11-00', '2026-1-18', 'invalid']) {
    assert.equal(isValidBookingDate(value, now), false, value);
  }
});

test('rechecks the current day when a booking stays open overnight', () => {
  assert.equal(isValidBookingDate('2026-11-18', new Date(2026, 10, 18, 23, 59)), true);
  assert.equal(isValidBookingDate('2026-11-18', new Date(2026, 10, 19, 0, 1)), false);
});

test('doctor and service handlers block invalid dates before advancing or submitting', () => {
  for (const [file, dateState, handlerNames] of [
    ['doctor', { dateOption: 'CUSTOM', customDate: '' }, ['handleNextFromStep1', 'handleSubmitBooking']],
    ['service', { preferredDate: '' }, ['handleNextFromStep2', 'handleSubmitBooking']],
  ]) {
    const code = fs.readFileSync(`src/app/book/${file}/[slug]/page.tsx`, 'utf8');
    const root = ts.createSourceFile('page.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const handlers = new Map();
    function visit(node) {
      if (ts.isVariableDeclaration(node) && handlerNames.includes(node.name.getText(root))) {
        handlers.set(node.name.getText(root), node.initializer.getText(root));
      }
      ts.forEachChild(node, visit);
    }
    visit(root);
    for (const name of handlerNames) {
      assert.ok(handlers.has(name), name);
      let error = '';
      const context = {
        ...dateState, isValidBookingDate,
        setErrorMsg: message => { error = message; },
        setStep: step => assert.equal(step, file === 'doctor' ? 1 : 2),
      };
      const handler = vm.runInNewContext(ts.transpileModule(`(${handlers.get(name)})`, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
      }).outputText, context);
      handler({ preventDefault() {} });
      assert.match(error, /valid appointment date/, `${file} ${name}`);
    }
  }
});
