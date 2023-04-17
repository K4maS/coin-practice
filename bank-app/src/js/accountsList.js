import { el, setChildren, setAttr } from 'redom';
import { getAccounts, createAccount } from './requests'
import { AccountItem } from './classes';
import Choices from 'choices.js';
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
    .finally(setAttr(spinner, { style: { display: 'none' } }));


  return accounts;
}
// Создание верхнего элемента страницы
function createTop(router, accountList) {
  const topBlock = el('div.accounts__top');
  const accountsTitle = el('h1.accounts__title.title', 'Ваши счета');
  const sort = el('select.accounts__sort.form-select',);
  const spinner = el('span.spinner-border.spinner-border-sm', { role: 'status', 'aria-hidden': 'true', style: 'display: none' });
  const createBtn = el('button.btn.btn-primary', spinner, "Создать новый счёт");
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

    // let coiceSort = new Choices(sort);
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
    // Добавление спиннера
    spinner.style.display = '';
    createAccount(token).then(res => {
      new AccountItem(router, document.querySelector('.accounts__list'), res.payload);
    }
    )
      .catch((err) => { console.log(err) })
      .finally(spinner.style.display = 'none')
  })

  setChildren(sort, options);
  setChildren(topBlock, [accountsTitle, sort, createBtn])

  return topBlock;
}

