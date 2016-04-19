'use strict';

/* global require */

const LoginForm = require(`login-form`);

function asyncAssert(cb) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      cb();
      resolve();
    });
  });
}

function createFormElement() {
  const formEl = document.createElement(`form`);
  formEl.innerHTML = `
    <input class="login-form__email">
    <input class="login-form__password">
    <div class="login-form__validation-message"></div>
    <button>Save</button>
  `;

  return formEl;
}

test(`the LoginForm class exists`, (assert) => {
  const formEl = createFormElement();

  assert.ok(LoginForm, `The "login-form" module should export a class`);

  assert.ok(new LoginForm(formEl, `email@email.com`) instanceof LoginForm,
    `The LoginForm should be a class or constructor function`);
});

test(`the LoginForm can check for valid login attempts`, (assert) => {
  const formEl = createFormElement();
  const form = new LoginForm(formEl, `email@email.com`);

  assert.ok(form.validate(`aaron@theironyard.com`, `password123`),
    `The form should validate with credentials aaron@theironyard.com:password123`);
  assert.ok(form.validate(`admin@google.com`, `pandas`),
    `The form should validate with credentials admin@google.com:pandas`);
  assert.ok(form.validate(`email@email.com`, `honeycrisp`),
    `The form should validate with credentials email@email.com:pandas`);

  assert.notOk(form.validate(``, ``),
    `The form should not validate with empty credentials`);
  assert.notOk(form.validate(`notavalidemail`, `pass`),
    `The form should not validate with an invalid email notavalidemail:pass`);
  assert.notOk(form.validate(`email@email.com`, `pandas`),
    `The form should not validate with mixed credentials email@email.com:pandas`);

  const formDiff = new LoginForm(formEl, `ryan@theironyard.com`);

  assert.ok(formDiff.validate(`ryan@theironyard.com`, `honeycrisp`),
    `The form should validate with email passed in to the constructor email@email.com:pandas`);
  assert.notOk(formDiff.validate(`email@email.com`, `honeycrisp`),
    `The form should not validate with an email
     not passed into the constructor email@email.com:pandas`);
});

test(`the LoginForm should be able to validate inputs`, (assert) => {
  // Tells test to wait since clicks are async
  const formEl = createFormElement();

  const form = new LoginForm(formEl, `email@email.com`);
  const validationMessage = formEl.querySelector(`.login-form__validation-message`);
  const emailInput = formEl.querySelector(`.login-form__email`);
  const passwordInput = formEl.querySelector(`.login-form__password`);

  // Attempt validating an empty form
  form.validateInputs();

  assert.equal(validationMessage.innerText.trim(), `The credentials are invalid`,
    `The validation message element should read
     "The credentials are invalid" with invalid inputs`);

  // Fill in the form with valid credentials
  emailInput.value = `email@email.com`;
  passwordInput.value = `honeycrisp`;
  form.validateInputs();

  assert.equal(validationMessage.innerText.trim(), ``,
    `There should be no validation message when the credentials are filled in correctly`);
});

test(`the LoginForm should validate when submitted`, (assert) => {
  const done = assert.async();
  // Tells test to wait since clicks are async
  const formEl = createFormElement();

  const form = new LoginForm(formEl, `email@email.com`);
  const validationMessage = formEl.querySelector(`.login-form__validation-message`);
  const emailInput = formEl.querySelector(`.login-form__email`);
  const passwordInput = formEl.querySelector(`.login-form__password`);
  const button = formEl.querySelector(`button`);

  // Attempt validating an empty form
  button.click();

  asyncAssert(() => {
    assert.equal(validationMessage.innerText.trim(), `The credentials are invalid`,
      `The validation message element should read
       "The credentials are invalid" when the form submits with invalid inputs`);
  }).then(() => {
    // Fill in the form with valid credentials
    emailInput.value = `email@email.com`;
    passwordInput.value = `honeycrisp`;
    form.validateInputs();

    assert.equal(validationMessage.innerText.trim(), ``,
      `There should be no validation message when the form is submitted correctly`);
    done();
  });
});
