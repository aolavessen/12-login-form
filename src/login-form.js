
export default class LoginForm {
  constructor(form, email) {
    this.form = form;

    this.userDirectory = [
      { email: `aaron@theironyard.com`, password: `password123` },
      { email: `admin@google.com`, password: `pandas` },
      { email, password: `honeycrisp` },
      // { email: `email@email.com`, password: `pandas`},
    ];
  }


  validate(email, password) {
    return this.userDirectory.reduce((prev, current) => {
      if (current.email === email && current.password === password) {
        return true;
      }

      return prev;
    }, false);

  }

  validateInputs() {
    const emailInput = this.form.querySelector(`.login-form__email`).value;
    const passwordInput = this.form.querySelector(`.login-form__password`).value;
    const valMsg = this.form.querySelector(`.login-form__validation-message`);
    if (this.validate(emailInput, passwordInput)) {
      valMsg.innerText = ``;
    } else {
      valMsg.innerText = `The credentials are invalid`;
    }
  }
 }
