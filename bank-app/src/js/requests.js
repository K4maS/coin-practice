// Адрес запроса
const URL = 'http://localhost:3000';
// Адрес запроса websocket
const URL_WS = 'ws://localhost:3000';

// Отправка запроса на авторизацию
export async function authorizeRequest(login, password) {

  const response = await fetch(URL + '/login', {
    method: 'POST',
    body: JSON.stringify({
      login,
      password,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  return await response.json();
}

// Запрос на получение элементов
export async function getAccounts(token) {
  return await fetch(URL + '/accounts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

// Запрос на поулчение счета
export function getAccount(id, token) {
  return fetch(URL + `/account/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => { return res.json() });
}

// Запрос на создание нового счета
export async function createAccount(token) {
  return await fetch(URL + '/create-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

// Перевод со счета на счет
export async function currencyTransfer(from, to, amount, token) {
  return await fetch(URL + '/transfer-funds', {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

// Метод совершения валютного обмена
export async function currencyBuy(from, to, amount, token) {
  return await fetch(URL + '/currency-buy', {
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      amount,
    }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  }).then((res) => res.json());
}

// Запрос на получение данных о геолокации банкоматов
export async function getAtms(token) {
  return await fetch(URL + '/banks', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  },).then((data) =>
    data.json()
  );
};

// Запрос websocket будет выдавать сообщения об изменении курса обмена валют
export function getChangedCurrency() {
  return new WebSocket(URL_WS + '/currency-feed');
}

//Запрос отвечает массивом со списком кодов всех используемых бекэндом валют на данный момент, например:
export async function getKnownCurrwncies() {
  return await fetch(URL + '/all-currencies').then((data) =>
    data.json()
  );
}


// Запрос возвращает список валютных счетов текущего пользователя.
// Отвечает объектом с информацией о балансах валютных счетов данного пользователя:
export async function getMyCurrwncies(token) {
  return await fetch(URL + '/currencies', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${token}`,
    },
  },).then((data) =>
    data.json()
  );
}
