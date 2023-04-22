import { el, setChildren, setAttr } from 'redom';
import { getAccounts, createAccount } from './requests'
import { AccountItem } from './classes';
import Choices from 'choices.js';
import addingPlus from '../assets/images/svg/adding-plus.svg'
const token = localStorage.getItem('Token');





// Отрисовка странциы полностью
export default function accountsList(router) {

  const accounts = el('div.accounts');
  const container = el('div.container');
  const spinner = el('span.spinner.spinner-border', {
    role: 'status', 'aria-hidden': 'true',
  });

  setChildren(accounts, spinner);

  const accountList = el('ul.accounts__list');

  setChildren(accounts, container);

  setChildren(container, [createTop(router, accountList), accountList]);
  getAccounts(token)
    .then(res => {
      res.payload.forEach(item => {
        new AccountItem(router, accountList, item);
      })

    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => { spinner.style.display = 'none'; });


  return accounts;
}
// Создание верхнего элемента страницы
function createTop(router, accountList) {
  const topBlock = el('div.accounts__top');
  const accountsTitle = el('h1.accounts__title.title', 'Ваши счета');
  const sort = el('select.accounts__sort.form-select',);

  const spinner = el('span.spinner-border.spinner-border-sm', { role: 'status', 'aria-hidden': 'true', style: 'display: none' });
  const addingPlusImg = el('img', { src: addingPlus })
  const createBtn = el('button.btn.btn-primary#createAccount', spinner, addingPlusImg, "Создать новый счёт");
  const sortList = [
    { title: 'Сортировка', value: '' },
    { title: 'По номеру', value: 'number' },
    { title: 'По балансу', value: 'balance' },
    { title: 'По последней транзакции', value: 'last-transaction' },]
  const options = [];
  sortList.forEach(element => {
    let option;
    if (element.value === '') {
      option = el('option', { value: element.value, disabled: 'disabled', selected: 'selected', style: { display: 'none' } }, element.title);
    }
    else {
      option = el('option', { value: element.value }, element.title);
    }

    options.push(option);


  });


  // Сортировка списка при изменении данных выпадающего списка
  sort.addEventListener('change', function () {
    accountList.innerHTML = '';
    getAccounts(token)
      .then(res => {

        let sorted = res.payload;
        if (sort.value === 'number') {
          sorted = sorted.sort(function (a, b) {
            if (a.account < b.account) {
              return 1;
            }
            if (a.account > b.account) {
              return -1;
            }
            return 0;
          })
        }
        else if (sort.value === 'balance') {
          sorted = sorted.sort(function (a, b) {
            if (a.balance < b.balance) {
              return 1;
            }
            if (a.balance > b.balance) {
              return -1;
            }
            return 0;
          })
        }
        else if (sort.value === 'last-transaction') {
          sorted = sorted.sort(function (a, b) {
            if (a.transactions.date < b.transactions.date) {
              return 1;
            }
            if (a.transactions.date > b.transactions.date) {
              return -1;
            }
            return 0;
          })
        }
        else {
          sorted = res.payload;
        }
        sorted.forEach(item => {
          new AccountItem(router, accountList, item);
        })

      })
  })

  // Действие при нажатии на кнопу добавления нового счета
  createBtn.addEventListener('click', () => {

    spinner.style.display = '';

    addingPlusImg.style.display = 'none';

    createAccount(token).then(res => {
      new AccountItem(router, document.querySelector('.accounts__list'), res.payload);
      createBtn.classList.add('btn-success');
      createBtn.textContent = 'Новый счет создан';
      setTimeout(() => {
        createBtn.classList.add('btn-primary');
        createBtn.classList.remove('btn-success');
        createBtn.textContent = '';
        createBtn.append(addingPlusImg);
        createBtn.append(el('span', 'Создать новый счёт'));
      }, 3000);
    }
    )
      .catch((err) => {
        console.log(err)
        createBtn.classList.add('btn-danger');
        createBtn.textContent = 'Произошла ошибка';
        setTimeout(() => {
          createBtn.classList.add('btn-primary');
          createBtn.classList.remove('btn-danger');
          createBtn.textContent = '';
          createBtn.append(addingPlusImg);
          createBtn.append(el('span', 'Создать новый счёт'));
        }, 3000);
      })
      .finally(() => {
        spinner.style.display = 'none';
        addingPlusImg.style.display = '';
        createBtn.classList.remove('btn-primary');

      })
  })

  setChildren(sort, options);
  setChildren(topBlock, [accountsTitle, sort, createBtn])

  // Насторойки выпадающего списка Choices
  let coiceSort = new Choices(sort, {
    itemSelectText: '',
    searchEnabled: false,
    placeholder: true,
    placeholderValue: null,
    searchPlaceholderValue: null,
    prependValue: 'Сортировка',
    appendValue: null,
    renderSelectedChoices: 'auto',
    loadingText: 'Загрузка...',
    noResultsText: 'Результатов не найдено',
    noChoicesText: 'Нет вариантов для выбора',
  });
  return topBlock;
}

