const test = require("node:test");
const assert = require("node:assert/strict");
const { validateName, validateEmail, validatePhone, validatePassword } = require("../src/validation");

test("validates candidate names with letters and spaces", () => {
  assert.equal(validateName("Isabella Montoya"), true);
  assert.equal(validateName("José María O'Connor"), true);
  assert.equal(validateName("Isabella123"), false);
  assert.equal(validateName("Isabella@Montoya"), false);
});

test("validates email format", () => {
  assert.equal(validateEmail("persona@example.com"), true);
  assert.equal(validateEmail("persona@"), false);
  assert.equal(validateEmail("persona.example.com"), false);
});

test("validates numeric phone with 7 to 15 digits", () => {
  assert.equal(validatePhone("987654321"), true);
  assert.equal(validatePhone("1234567"), true);
  assert.equal(validatePhone("123456"), false);
  assert.equal(validatePhone("98765abc"), false);
});

test("requires password complexity", () => {
  assert.equal(validatePassword("Abcd1234!"), true);
  assert.equal(validatePassword("abcd1234!"), false);
  assert.equal(validatePassword("ABCD1234!"), false);
  assert.equal(validatePassword("Abcdefgh!"), false);
  assert.equal(validatePassword("Abcd1234"), false);
  assert.equal(validatePassword("Ab1!"), false);
});
