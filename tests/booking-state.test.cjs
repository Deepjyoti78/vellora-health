const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const ts = require('typescript');

function load(file) {
  const context = { exports: {}, require: path => path };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, context);
  return context.exports;
}

test('web store rejects wrong-category and pending providers and terminal-state reversal', () => {
  const { db } = load('src/lib/db.ts');
  const template = { ...db.getBookings()[0], providerId: undefined, status: 'REQUESTED' };
  const first = db.createBooking(template);
  const second = db.createBooking(template);
  assert.notEqual(first.id, second.id);
  const pending = db.createUser({ id: 'test-pending', role: 'DOCTOR', verificationStatus: 'PENDING' });
  assert.equal(db.assignProvider(first.id, pending.id), null);
  const wrongRole = db.createUser({ id: 'test-nurse', role: 'NURSE', verificationStatus: 'APPROVED' });
  assert.equal(db.assignProvider(first.id, wrongRole.id), null);
  assert.ok(db.updateBookingStatus(first.id, 'CANCELLED'));
  assert.equal(db.updateBookingStatus(first.id, 'COMPLETED'), null);
  assert.equal(db.getBookingById(first.id).status, 'CANCELLED');
  assert.equal(db.getDoctorBySlugOrId('pat-1'), undefined);
  assert.equal(db.getDoctorBySlugOrId('Maya'), undefined);
  assert.ok(db.getDoctorBySlugOrId('dr-maya-patel'));
});

test('mobile mutations notify mounted consumers, keep references, and preserve cancellation', () => {
  const store = load('vellora-health-mobile/src/data/mockData.ts');
  const booking = { ...store.RECENT_BOOKINGS[0], id: 'test-lab', serviceId: 'lab-tests', serviceTitle: 'CBC', totalPrice: 349, status: 'REQUESTED' };
  let notifications = 0;
  const unsubscribe = store.subscribeBookings(() => notifications++);
  const initial = store.getBookingRevision();
  store.addBooking(booking);
  assert.equal(store.getBookingById('test-lab').totalPrice, 349);
  assert.equal(store.rescheduleBooking('test-lab', '20 Nov 2026', '10:00 AM'), true);
  assert.equal(store.getBookingById('test-lab').scheduledDate, '20 Nov 2026');
  assert.equal(store.cancelBooking('test-lab', 'Changed plans'), true);
  assert.equal(store.getBookingById('test-lab').status, 'CANCELLED');
  assert.equal(store.rescheduleBooking('test-lab', '21 Nov 2026', '11:00 AM'), false);
  assert.equal(store.cancelBooking('missing', 'Changed plans'), false);
  assert.equal(notifications, 3);
  assert.equal(store.getBookingRevision(), initial + 3);
  unsubscribe();
});

test('mobile checkout saves the selected service, estimate, relationship, and generated reference', () => {
  const file = 'vellora-health-mobile/src/app/booking/[serviceId].tsx';
  const source = fs.readFileSync(file, 'utf8');
  const root = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let code;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(root) === 'handleStep4Pay') code = node.initializer.getText(root);
    ts.forEachChild(node, visit);
  }
  visit(root);
  let saved;
  let reference;
  const now = new Date();
  const context = {
    service: { id: 'lab-tests' }, serviceTitle: 'Complete Blood Count', savedBookingId: '',
    savingBooking: { current: false }, calendarYear: now.getFullYear(), calendarMonth: now.getMonth(), selectedDayNumber: now.getDate(),
    fullName: 'Demo family member', patientType: 'family', bookingConfirmedDate: 'Today', bookingConfirmedTime: '10:00 AM',
    totalPrice: 349, serviceAddress: 'Demo address', selectedReason: 'Blood test', generateSecurePin: () => '1234',
    addBooking: booking => { saved = booking; }, setSavedBookingId: id => { reference = id; }, setBookingStatus() {}, setCurrentStep() {},
  };
  const handler = vm.runInNewContext(ts.transpileModule(`(${code})`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText, context);
  handler();
  assert.equal(saved.serviceId, 'lab-tests');
  assert.equal(saved.totalPrice, 349);
  assert.equal(saved.patientRelationship, 'Family');
  assert.equal(saved.status, 'REQUESTED');
  assert.equal(saved.assignedClinician, undefined);
  assert.equal(reference, saved.id);
  assert.match(saved.paymentMethod, /no charge/);
});
