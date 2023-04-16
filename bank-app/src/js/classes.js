import { el, setChildren, setAttr } from 'redom';
import { accountAddress, balanceHistoryAddress } from './addresses';
import { currencyTransfer } from './requests';
import v8n from 'v8n';
import MissPlete from 'miss-plete';

const token = localStorage.getItem('Token');
const validated = [false, false];

// Класс счета
export class Account {
  _date
  _lastQuantityMonthsBalanceDynamic
  _balance
  constructor(account) {
    this.account = account;
    this._balance = this.account.balance;
  }

  get accountId() { return this.account.account; }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = value;
  }

  get mine() { return this.account.mine; }

  get transactions() { return this.account.transactions; }

  get formattedBalance() {
    let balance = String(this.balance);
    if (balance === '0') {
      return '0';
    }

    if (balance.includes('.')) {
      let index = balance.indexOf('.');
      balance = balance.slice(0, index);
    }
    balance = balance.split('').reverse();

    let formatted = [];
    for (let i = 0; i < balance.length; i++) {
      formatted.push(balance[i])
      if (((i + 1) % 3 === 0) && (i !== 0) && (i !== (balance.length))) {
        formatted.push(' ')

      }
    }
    formatted = formatted.reverse().join('');
    return formatted;
  }

  set dateNum(num) {
    if (this.account.transactions.length !== 0) {
      this._date = this.account.transactions[num].date;
    }
    else {
      this._date = '-';
    }

  }

  get date() {
    let month = monthTransformToText(this._date.slice(5, 7));
    let formattedDate = `${this._date.slice(8, 10)} ${month} ${this._date.slice(0, 4)}`;
    return formattedDate;
  }

  // Получение статистики по динамике счета
  get lastQuantityMonthsBalanceDynamic() {
    return this._lastQuantityMonthsBalanceDynamic
  }

  set lastQuantityMonthsBalanceDynamic(num) {

    let balanceDynamics = [];

    balanceDynamics.push(this.balance);
    let thisYear = Number(new Date().getFullYear());
    let thisMonth = Number(new Date().getMonth()) + 1;

    let dates = [];
    let date = monthTransformToText(thisMonth)
    dates.push(date);

    for (let i = 1; i < num; i++) {


      // Понижаем на 1 месяц
      if (thisMonth === 1) {
        thisYear = thisYear - 1;
        thisMonth = 12;
      }
      else {
        thisMonth = thisMonth - 1;
      }
      // Пишем дату в список
      let date = monthTransformToText(thisMonth)
      dates.push(date);

      // Вычисляем баланс месяца
      let lastBalance = balanceDynamics[balanceDynamics.length - 1];
      let lastMonthTransactionsSum = 0;
      let monthTransactions = [];
      let fullDate = String(thisYear) + '-' + String(String(thisMonth).length === 1 ? '0' + String(thisMonth) : thisMonth);
      this.transactions.forEach(elem => {
        if (elem.date.startsWith(fullDate)) monthTransactions.push(elem);
      })

      monthTransactions.forEach(elem => {
        // console.log('elem.from', elem.from, 'this.accountId', this.accountId)
        if (elem.to === this.accountId) {
          lastMonthTransactionsSum += Number(elem.amount)
        } else {
          lastMonthTransactionsSum -= Number(elem.amount)
        }
      }
      )

      balanceDynamics.push(Number(lastBalance) - (Number(lastBalance) - lastMonthTransactionsSum))
    }


    // balanceDynamics.reverse();
    let heightsArr = [];
    let max = 0;
    balanceDynamics.forEach(elem => {
      if (elem > max) {
        max = Math.round(elem);
      }
    })

    let percent = max / 100;
    for (let i in balanceDynamics) {
      heightsArr.push(
        {
          month: dates[i] === 'мая' ? dates[i] = 'май' : dates[i].slice(0, 3),
          height: (balanceDynamics[i] / percent)
        }
      )
    }


    this._lastQuantityMonthsBalanceDynamic = { heightsArr, max };
  }

  // Блок переводов
  transaction() {

    const transfrTitle = el('h2.transfer__title.sub-title', 'Новый перевод');

    const lableTextRecipient = el('span.transfer__label-text.label-text.form-label', 'Номер счета получателся');

    const transferChooseRecipient = el('input.transfer__to.form-control#to', { name: 'to', 'aria-label': "Счет получателя" });
    const transferChooseRecipientBlock = el('.transfer__to-block')
    let accountsList = JSON.parse(localStorage.getItem('accountsList'));

    // Автодополненеие
    new MissPlete({
      input: transferChooseRecipient,

      // Each subarray contains an option and all its synonyms
      options: accountsList ? accountsList : [],


    });

    setChildren(transferChooseRecipientBlock, transferChooseRecipient)



    const transferLabelRecipient = el('label.transfer__label.label', [lableTextRecipient, transferChooseRecipient]);

    const lableTextSum = el('span.transfer__label-text.label-text.form-label', 'Сумма перевода');
    const transferInputSum = el('input.transfer__input.input.form-control#amount', { type: 'number', placeholder: '' });
    const transferLabelSum = el('label.transfer__label.label', [lableTextSum, transferInputSum]);


    const spinner = el('span.spinner-border.spinner-border-sm', { role: 'status', 'aria-hidden': 'true', style: 'display: none' });
    const btn = el('button.btn.btn-primary', spinner, "Отправить");
    const errorMessage = el('p.transfer__error', '');

    const accountTransfer = el('.account__transfer.transfer', [transfrTitle, transferLabelRecipient, transferLabelSum, btn, errorMessage]);

    // Валидация инпутов
    [transferChooseRecipient, transferInputSum].forEach(input => {
      input.classList.remove('is-invalid');
      input.addEventListener('blur', (e) => {
        inputValidation(input, e);

      })
    })
    // При нажатии на кнопку отправить
    btn.addEventListener('click', () => {

      errorMessage.textContent = '';
      if (!(validated[0] * validated[1])) {
        errorMessage.textContent = 'Данные не должны быть отрицательны или пусты';
        return;
      }
      else if (Number(transferInputSum.value) === 0) {
        errorMessage.textContent = 'Сумма перевода должна быть больеш нуля';
        return;
      }
      else {
        currencyTransfer(this.accountId, transferChooseRecipient.value, transferInputSum.value, token)
          .then(elem => {
            if (elem.error === `Invalid account from`) {
              errorMessage.textContent = 'Не указан адрес счёта списания, или этот счёт не принадлежит вам';
            }
            if (elem.error === `Invalid account to`) {
              errorMessage.textContent = 'Не указан счёт зачисления, или этого счёта не существует';
            }
            if (elem.error === `Invalid amount`) {
              errorMessage.textContent = 'Не указана сумма перевода, или она отрицательная';
            }
            if (elem.error === `Overdraft prevented`) {
              errorMessage.textContent = 'Недостатнчно средств на счете';
            }
            else {
              const currentTransaction = elem.payload.transactions[elem.payload.transactions.length - 1]
              createTabelRow(document.querySelector('.history__table'), currentTransaction, this.accountId, true);
              this.balance = elem.payload.balance;
              let accountsList = JSON.parse(localStorage.getItem('accountsList'));
              let account = [currentTransaction.to, currentTransaction.to]
              if (!accountsList) {
                localStorage.setItem('accountsList', JSON.stringify([account]))
              }
              else {
                if (!accountsList.includes(account)) {
                  accountsList.push(account);
                  localStorage.setItem('accountsList', JSON.stringify(accountsList));
                };

              }
            }

          })
          .catch(err => {

          });
      }



    })

    return accountTransfer;

  }

  // Блок динамики баланса
  balanceDynamics(router, months = 6) {

    // Количество месяцев для выведения в диограмме
    this.lastQuantityMonthsBalanceDynamic = months;

    // Прорисовка диограммы
    const balanceTitle = el('h2. balance__title.sub-title', 'Динамика баланса');
    const maxSum = el('p.balance__max', this.lastQuantityMonthsBalanceDynamic.max);
    const minSum = el('p.balance__min', '0');
    const minmaxBlock = el('.balance__minmax', [maxSum, minSum])
    let diogrammList = [];
    this.lastQuantityMonthsBalanceDynamic.heightsArr.forEach((elem) => {
      let setHeight = elem.height;
      const item = el('li.balance__item.item', { style: { height: setHeight + '%' } }, el('p.item__month', elem.month));

      diogrammList.push(item);
    }

    )
    const balanceMainBlock = el('.balance__main-block',
      [el('ul.balance__list', [diogrammList]), minmaxBlock,]
    )


    const linkToHistory = el('a.balance__link.link-to-histry', {
      href: balanceHistoryAddress + '/' + this.accountId,
      onclick(event) {
        // event.preventDefault();
        router.navigate(event.target.getAttribute('href'));
      },
    }, [balanceTitle, balanceMainBlock])

    const accountBalanceDynamic = el('.account__balance-dynamic.balance-dynamic.balance', linkToHistory);
    return accountBalanceDynamic;
  }

  // История переводов
  history(router, rows = 10) {

    // Прорисовка таблицы
    const historyTitle = el('h2. history__title.sub-title', 'История переводов');
    const historyTable = el('table.history__table.table');


    const tableHeader = el('tr.table__header', [
      el('th.table__header-col.th.table__header-col-fitst ', el('p.table__header-text', 'Счет отправителя')),
      el('th.table__header-col', el('p.table__header-text', 'Счет получателя')),
      el('th.table__header-col', el('p.table__header-text', 'Сумма')),
      el('th.table__header-col.th.table__header-col-last', el('p.table__header-text', 'Дата')),]);
    historyTable.append(tableHeader);

    // Передача данных в таблицу
    this.transactions.reverse().slice(0, rows).forEach(elem => {


      createTabelRow(historyTable, elem, this.accountId)
    })

    const linkToHistory = el('a.balance__link.link-to-histry', {
      href: balanceHistoryAddress + '/' + this.accountId,
      onclick(event) {
        event.preventDefault();


        router.navigate(event.target.getAttribute('href'));
      },
    }, [historyTitle, historyTable])


    const accountHistory = el('.accounts__history.history', linkToHistory);
    return accountHistory;
  }



}

// Класс для вывода карточки счета
export class AccountItem extends Account {

  constructor(router, container, account) {
    super(account);
    this.container = container;
    this.router = router;
    this.dateNum = 0;
    this.accoutnCard(this.router, this.container, this.account);
  }



  // Создание элемента карточки
  accoutnCard(router, container, account) {

    let accountId = el('h3.item__id', account.account);
    let accountBalance = el('p.item__balance', `${this.formattedBalance} ₽`);
    let accountText = el('p.item__text', 'Последняя транзакция:');
    let accountDate = el('p.item__date', this.date);
    let openBtn = el('a.btn.btn-primary.item__btn', {
      href: `${accountAddress}/${account.account}`,
      onclick(event) {
        event.preventDefault();
        router.navigate(event.target.getAttribute('href'));
        const btnsBtns = document.querySelectorAll('.nav__btn');
        btnsBtns.forEach(elem => elem.classList.remove('disabled'));
      }
    }, 'Открыть');
    let topBlock = el('.item__top', [accountId, accountBalance]);
    let dateBlock = el('.item__date-block', [accountText, accountDate]);
    let bottomBlock = el('.item__bottom', [dateBlock, openBtn]);
    let cardItem = el('li.accounts__item.item', [topBlock, bottomBlock]);
    container.append(cardItem);



    return cardItem;
  }
}


// Перевод чисел месяцев в словарные обозначени
function monthTransformToText(date) {

  switch (Number(date)) {

    case 1:
      date = 'января';
      break;
    case 2:
      date = 'феваля';
      break;
    case 3:
      date = 'марта';
      break;
    case 4:
      date = 'апреля';
      break;
    case 5:
      date = 'мая';
      break;
    case 6:
      date = 'июня';
      break
    case 7:
      date = 'июля';
      break;
    case 8:
      date = 'августа';
      break;
    case 9:
      date = 'сенября';
      break;
    case 10:
      date = 'октября';
      break;
    case 11:
      date = 'ноября';
      break;
    case 12:
      date = 'декабря';
      break;
  }
  return date
}

function createTabelRow(historyTable, elem, accountId, first = false) {
  let fontСolor = '#000000';
  let positivity = '';
  let date = `${elem.date.slice(8, 10)}.${elem.date.slice(5, 7)}.${elem.date.slice(0, 4)}`;
  if (elem.from !== accountId) {
    fontСolor = '#76CA66';
    positivity = '+ ';
  } else {
    fontСolor = '#FD4E5D';
    positivity = '- ';
  }


  const tableRow = el('tr.table__row',
    [el('td.table__row-col', el('p.table__row-text', elem.from)),
    el('td.table__row-col', el('p.table__row-text', elem.to)),
    el('td.table__row-col', el('p.table__row-text', { style: { color: fontСolor } },
      `${positivity} ${elem.amount} ₽`)),
    el('td.table__row-col', el('p.table__row-text', date)),]);
  if (!first) {
    historyTable.append(tableRow)
  } else {
    historyTable.insertBefore(tableRow, document.querySelector('.table__row'));
  }
}

// Валидация ввода в поля
function inputValidation(input, e) {
  let id = null;
  if (e.target.id === 'to') {
    id = 0;
  }
  else if (e.target.id === 'amount') {
    id = 1;
  }
  if (!v8n()
    .numeric()
    .not.negative()
    .minLength(1)
    .test(input.value)
  ) {
    input.classList.add('is-invalid');
    validated[id] = false;
  }
  else {
    input.classList.remove('is-invalid');
    validated[id] = true;
  }

}
