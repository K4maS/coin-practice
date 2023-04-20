import v8n from 'v8n';
import { el, setChildren, setAttr } from 'redom';
import { authorizeRequest } from './requests';
import { accountsListAddress } from './addresses';
let validated = [false, false];

// Создание болка авторизации
export default function createAuthorization(router) {

  const container = el('div.container.authorization');

  const authorizationBlock = el('form.authorization__form.p5');
  const authorizationTitle = el('h1.authorization__title.title', 'Вход в аккаунт');

  const authorizationLabelLogin = el('label.authorization__label.label');
  const lableTextLogin = el('span.authorization__label-text.label-text.form-label', 'Логин');
  const authorizationInputLogin = el('input.authorization__input.input.form-control#login', {
    type: 'text', placeholder: 'User',
    value: 'developer'
  });

  const authorizationLabelPassword = el('label.authorization__label.label');
  const lableTextPassword = el('span.authorization__label-text.label-text.form-label', 'Пароль');
  const authorizationInputPassword = el('input.authorization__input.input.form-control#password', {
    type: 'password', placeholder: 'Password',
    value: 'skillbox'
  });
  const spinner = el('span.spinner-border.spinner-border-sm', { role: 'status', 'aria-hidden': 'true', style: 'display: none' });
  const btn = el('button.btn.btn-primary', spinner, "Войти");
  const errorMessage = el('p.authorization__error');


  setChildren(authorizationLabelLogin, [lableTextLogin, authorizationInputLogin]);
  setChildren(authorizationLabelPassword, [lableTextPassword, authorizationInputPassword]);

  setChildren(authorizationBlock, [authorizationTitle, authorizationLabelLogin, authorizationLabelPassword, btn, errorMessage]);

  setChildren(container, authorizationBlock);

  // При расфокусе полей:
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
  if (!authorizationInputLogin.value || !authorizationInputPassword.value) {
    btn.classList.add('disabled');
  } else {
    btn.classList.remove('disabled');
  };
  // При нажатии на кнопку:
  btn.addEventListener('click', (event) => {
    // setAttr(spinner, { style: { display: '' } });
    event.preventDefault();
    let login = authorizationInputLogin.value;
    let password = authorizationInputPassword.value;

    const href = accountsListAddress;

    authorizeRequest(login, password)
      .then((response) => {
        console.log('response', response)
        if (response.payload !== null) {
          localStorage.setItem('Token', response.payload.token);
          router.navigate(href);
          let nav = document.querySelector('.nav__list');
          const btnsBtns = document.querySelectorAll('.nav__btn');
          console.log(nav)
          nav.style.display = '';
          btnsBtns[1].classList.add('disabled');
        }
        else {
          if (response.error === 'Invalid password') {
            errorMessage.textContent = 'Введите верный пароль';
          }
          else if (response.error === 'No such user') {
            errorMessage.textContent = 'Такого пользователя не существует';
          }
          else {
            errorMessage.textContent = response.error;
          }
        }

      })
      .catch(err => {

        let error = err.error;
        console.log('err', err)


        errorMessage.textContent = error;

      })
      .finally(() => { setAttr(spinner, { style: { display: 'none' } }) });






  })
  return container;
}

// Валидация ввода в поля
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
    document.querySelector('.authorization__error').textContent = 'Поле не должно содержать пробелов и быть короче 6 символов';
  }
  else {
    input.classList.remove('is-invalid');
    validated[id] = true;
    document.querySelector('.authorization__error').textContent = '';
  }

}

