import 'babel-polyfill';
import '../css/style.scss';
import Navigo from 'navigo';
import { el, setChildren } from 'redom';
import createHeader from './header';
import createAuthorization from "./login";
import accountsList from './accountsList';
import createAtms from './atms';
import createСurrency from './currency';
import createAccoutn from './account';
import { accountAddress, accountsListAddress, atmAddress, balanceHistoryAddress, currencyAddress, loginAddress } from './addresses';
import createHistory from './history';


// Инициализация навиго
const router = new Navigo('/');
const app = el('div#app');


// Установка хедера
setChildren(window.document.body, [createHeader(router), app]);

// Переход на страницу авторизации(при открытии так же открывается этот блок)
router.on('/', () => {
  setChildren(app, createAuthorization(router));
})

// Переход на страницу списка счетов
router.on(accountsListAddress, () => {
  setChildren(app, accountsList(router));
})
// Переход на страницу счета
router.on(accountAddress + '/:id', ({ data: { id } }) => {
  setChildren(app, createAccoutn(router, id));
});

// Переход на страницу расширенной истории счета
router.on(balanceHistoryAddress + '/:id', ({ data: { id } }) => {
  setChildren(app, createHistory(router, id));
});
// }
// Переход на страницу валют
router.on(currencyAddress, () => {
  setChildren(app, createСurrency());
})

// Переход на страницу карты банкоматов
router.on(atmAddress, () => {
  setChildren(app, createAtms());
})


router.resolve();
