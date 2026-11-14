'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Accessible mobile navigation.
const menuToggle = $('#menuToggle');
const siteNav = $('#siteNav');
function closeMenu() {
  siteNav.classList.remove('nav-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  $('use', menuToggle).setAttribute('href', '#i-menu');
}
menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('nav-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  $('use', menuToggle).setAttribute('href', isOpen ? '#i-close' : '#i-menu');
});
$$('.site-nav a').forEach(link => link.addEventListener('click', () => {
  $$('.site-nav a').forEach(item => item.classList.remove('nav-active'));
  link.classList.add('nav-active');
  closeMenu();
}));
document.addEventListener('click', (event) => {
  if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

// Native scroll-snap sliders with keyboard-friendly arrow controls.
$$('[data-next], [data-prev]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.next || button.dataset.prev;
  const track = document.getElementById(id);
  const card = track.firstElementChild;
  if (!card) return;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const amount = card.getBoundingClientRect().width + gap;
  track.scrollBy({ left: amount * (button.dataset.next ? 1 : -1), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}));

// One FAQ answer open at a time.
$$('.faq-list details').forEach(detail => detail.addEventListener('toggle', () => {
  if (detail.open) $$('.faq-list details').forEach(other => { if (other !== detail) other.open = false; });
}));

// Appointment form is an explicit frontend demo: it never sends data to a server.
const modalBackdrop = $('#bookingModal');
const modalPanel = $('.booking-modal');
const modalClose = $('#modalClose');
const bookingForm = $('#bookingForm');
const bookingSuccess = $('#bookingSuccess');
const bookingSpecialty = $('#bookingSpecialty');
const bookingDoctor = $('#bookingDoctor');
let returnFocus = null;
function openBooking({ specialty = '', doctor = '' } = {}) {
  returnFocus = document.activeElement;
  bookingForm.reset();
  bookingForm.hidden = false;
  bookingSuccess.hidden = true;
  if (specialty) {
    if ([...bookingSpecialty.options].some(option => option.value === specialty)) bookingSpecialty.value = specialty;
  }
  if (doctor) bookingDoctor.value = doctor;
  modalBackdrop.classList.add('is-visible');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('#patientName').focus();
}
function closeBooking() {
  modalBackdrop.classList.remove('is-visible');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  returnFocus?.focus();
}
$$('[data-book]').forEach(button => button.addEventListener('click', () => openBooking()));
$$('[data-book-link]').forEach(link => link.addEventListener('click', (event) => {
  event.preventDefault();
  openBooking();
}));
$$('[data-specialty]').forEach(button => button.addEventListener('click', () => openBooking({ specialty: button.dataset.specialty })));
$$('[data-doctor]').forEach(button => button.addEventListener('click', () => openBooking({ doctor: button.dataset.doctor })));
modalClose.addEventListener('click', closeBooking);
$('#bookingDone').addEventListener('click', closeBooking);
modalBackdrop.addEventListener('mousedown', event => { if (event.target === modalBackdrop) closeBooking(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (modalBackdrop.classList.contains('is-visible')) closeBooking();
    else closeMenu();
  }
  if (event.key !== 'Tab' || !modalBackdrop.classList.contains('is-visible')) return;
  const focusable = $$('button:not([disabled]):not([hidden]), input:not([disabled]), select:not([disabled]), a[href]', modalPanel)
    .filter(item => item.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
const dateInput = $('#bookingDate');
const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
dateInput.min = localDate;
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;
  bookingForm.hidden = true;
  bookingSuccess.hidden = false;
  $('#bookingDone').focus();
});

$('#footerYear').textContent = new Date().getFullYear();
