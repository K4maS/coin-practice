import v8n from 'v8n';
import { el, setChildren } from 'redom';
import URL from './path';
let validated = [false, false];

export default function createAuthorization(router) {
  const container = el('div.container.authorization');

  const authorizationBlock = el('form.authorization__form.p5');
  const authorizationTitle = el('h1.authorization__title.title', 'Вход в аккаунт');

  const authorizationLabelLogin = el('label.authorization__label.label');
  const lableTextLogin = el('span.authorization__label-text.label-text.form-label', 'Логин');
  const authorizationInputLogin = el('input.authorization__input.input.form-control#login', { type: 'text', placeholder: 'Введите логин' });

  const authorizationLabelPassword = el('label.authorization__label.label');
  const lableTextPassword = el('span.authorization__label-text.label-text.form-label', 'Пароль');
  const authorizationInputPassword = el('input.authorization__input.input.form-control#password', { type: 'password', placeholder: 'Введите пароль' });

  const btn = el('button.btn.btn-primary.disabled', "Войти");


  setChildren(authorizationLabelLogin, [lableTextLogin, authorizationInputLogin]);
  setChildren(authorizationLabelPassword, [lableTextPassword, authorizationInputPassword]);

  setChildren(authorizationBlock, [authorizationTitle, authorizationLabelLogin, authorizationLabelPassword, btn]);

  setChildren(container, authorizationBlock);

  [authorizationInputLogin, authorizationInputPassword].forEach(input => {
    input.addEventListener('blur', (e) => {
      inputValidation(input, e);
      if (validated[0] * validated[1]) {
        btn.classList.remove('disabled');

      } else {
        btn.classList.add('disabled');
      };
    })

  })
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    // let login = authorizationInputLogin.value;
    // let password = authorizationInputPassword.value;
    let login = 'developer';
    let password = 'skillbox';
    let href = '/card-list';
    authorizeRequest(login, password);



    // router.navigate(href);

  })
  return container;
}

function inputValidation(input, e) {
  // console.log(e)
  let id = null;
  if (e.target.id === 'login') {
    id = 0;
  }
  else if (e.target.id === 'password') {
    id = 1;
  }
  if (!v8n().minLength(6).not.includes(' ').test(input.value)) {
    input.classList.add('is-invalid');
    validated[id] = false;
  }
  else {
    input.classList.remove('is-invalid');
    validated[id] = true;
  }

}

function authorizeRequest(login, password) {
  fetch(URL + `/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: {
      login,
      password,
    }

  })
    .then((response) => { console.log(response) })
}
