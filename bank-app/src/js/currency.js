import { el, setAttr, setChildren, setStyle } from 'redom';
import { getKnownCurrwncies, getMyCurrwncies, currencyBuy, getChangedCurrency } from './requests';
import Choices from 'choices.js';
import v8n from 'v8n';

const token = localStorage.getItem('Token');

export default function createСurrency() {
  const currency = el('div.currency');
  const container = el('div.container');
  const topBlock = el('div.currency__top');
  const currencyTitle = el('h1.currency__title.title', 'Валютный обмен');
  setChildren(topBlock, currencyTitle);

  const mainBlock = el('div.currency__main', createYourCurrencies(), createExchangeCurrencies(), createCurrenciesCourses());
  setChildren(currency, container);
  setChildren(container, [topBlock, mainBlock]);

  return currency;
}

function createYourCurrencies() {

  const title = el('h2.your-currencies__title.sub-title', 'Ваши валюты');

  const list = el('ul.your-currencies__list.list');


  getMyCurrwncies(token).then(res => {
    creatingMyTokensList(list, res.payload);
  }
  )





  const yourCurencies = el('.your-currencies', [title, list]);
  return yourCurencies;
}


function createExchangeCurrencies() {

  const title = el('h2.exchanging__title.sub-title', 'Обмен валюты');

  const lableTextFrom = el('span.exchanging__label-text.label-text.form-label', 'Из');
  const selectFrom = el('select.exchanging__select.form-select', { name: 'from' });
  const exchangingLabelFrom = el('label.exchanging__label.label', [lableTextFrom, selectFrom]);


  const lableTextTo = el('span.exchanging__label-text.label-text.form-label', 'В');
  const selectTo = el('select.exchanging__select.form-select', { name: 'to' });
  const exchangingLabelTo = el('label.exchanging__label.label', [lableTextTo, selectTo]);


  // Нужно сделать валидацию
  const lableTextSum = el('span.exchanging__label-text.label-text.form-label', 'Сумма');
  const exchangingInputSum = el('input.exchanging__input.input.form-control#login', {
    type: 'number', placeholder: 'Введите cумму',
  });

  const exchangingLabelSum = el('label.exchanging__label.label', [lableTextSum, exchangingInputSum]);

  let btn = el('a.btn.btn-primary.item__btn', {
  }, 'Обменять');
  const inputTop = el('.exchanging__input-top', [exchangingLabelFrom, exchangingLabelTo]);
  const inputsBlock = el('.exchanging__inputs-block', [inputTop, exchangingLabelSum])
  const errorMessage = el('p.exchanging__error', '');
  const successMessage = el('p.exchanging__success', { style: 'display: none' }, 'Перевод выполнен успещно!');

  const mainBlock = el('.exchanging__main', [inputsBlock, btn])
  const exchangeCurencies = el('.exchanging', [title, mainBlock, errorMessage, successMessage]);


  createOptionsForSelect(selectFrom);
  createOptionsForSelect(selectTo, Math.round(Math.random() * 15));

  // При нажатии на кнопку отправить
  btn.addEventListener('click', () => {
    let listGot = document.querySelector('.your-currencies__list')
    exchangingInputSum.classList.remove('is-invalid');
    if (!exchangingInputValidation(exchangingInputSum)) {
      exchangingInputSum.classList.add('is-invalid');
      return;
    }
    currencyBuy(selectFrom.value, selectTo.value, exchangingInputSum.value, token)
      .then(res => {
        console.log(res);

        if (res.error === `Unknown currency code`) {
          errorMessage.textContent = 'Передан не поддерживаемый валютный код';
        }
        else if (res.error === `Overdraft prevented`) {
          errorMessage.textContent = 'Сумма выше валютного остатка на счете';
        }
        else if (res.error === `Invalid amount`) {
          errorMessage.textContent = 'Укажите сумму перевода, она должна быть положительной';
        }
        else if (res.error === `Not enough currency`) {
          errorMessage.textContent = 'Недостатнчно средств на счете';
        }
        else {
          listGot.innerHTML = '';
          creatingMyTokensList(listGot, res.payload);
          let successMessage = document.querySelector('.exchanging__success');
          successMessage.style.display = '';
          setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
          exchangingInputSum.value = '';
        }

      })



  })

  return exchangeCurencies;
}


function createCurrenciesCourses() {

  const title = el('h2.currencies-courses__title.sub-title', 'Изменение курсов в реальном времени');

  const list = el('ul.currencies-courses__list.list');

  // let placeholderList = [];
  // for (let i; i <= 21; i++) {
  //   placeholderList.push({ code: '1', amount: '1', })
  // }
  // creatingMyTokensList(list, placeholderList);

  getChangedCurrency().onmessage = res => {
    let response = JSON.parse(res.data);
    const fromTo = response.from + '/' + response.to
    const currencyName = el('span.item__currency', fromTo);
    let dots = el('span.item__dots');
    const value = el('span.item__value', response.rate);
    let triangle = el('span.item__triange-unset');

    if (response.change === -1) {
      triangle = el('span.item__triange-negative');
      dots = el('span.item__dots-red');
    }
    else if (response.change === 1) {
      triangle = el('span.item__triange');
      dots = el('span.item__dots-green');
    }
    let itemList = [currencyName, dots, value, triangle];



    const item = el('li.currencies-courses__item.item.' + fromTo, itemList);

    list.append(item);
    if (list.children.length > 21) {
      list.firstChild.remove();
    }
  }


  const yourCurencies = el('.currencies-courses', [title, list]);
  return yourCurencies;
}


// Добавление опции для селекта через запрос на получение списка валют
function createOptionsForSelect(select, activElemNum = 0) {
  getKnownCurrwncies().then(res => {

    if (!res.error) {
      console.log(res.payload);
      let num = 0;
      res.payload.forEach(element => {
        let option;

        if (num === activElemNum) {
          num++;
          option = el('option', { value: element, selected: 'selected', }, element);
        }
        else {
          if (num <= activElemNum) num++
          else activElemNum = 0;
          option = el('option', { value: element }, element);
        }
        select.append(option);

      });

    }

    let choices = new Choices(select, {
      itemSelectText: '',
      searchEnabled: false,
    });

  })
}

// валидация ввода суммы обмена
function exchangingInputValidation(exchangingInputSum) {
  if (!v8n()
    .numeric()
    .not.negative()
    .minLength(1).test(exchangingInputSum.value)) {
    return false;
  }
  return true;
}

// Получение списка валюты
function creatingMyTokensList(list, coins) {
  console.log(coins);

  if (coins) {
    for (let key in coins) {
      const currencyName = el('span.item__currency', coins[key].code);
      const dots = el('span.item__dots');
      const value = el('span.item__value', coins[key].amount);
      let itemList = [currencyName, dots, value];


      const item = el('li.currencies-courses__item.item', itemList);

      list.append(item);

    }

  } else {
    setChildren(list, el('h3.empty', 'У вас нет купленой валюты'));
  }

}
