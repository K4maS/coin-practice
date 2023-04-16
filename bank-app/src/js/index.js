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
import { accountAddress, accountsListAddress, atmAddress, balanceHistoryAddress, currencyAddress } from './addresses';
import createHistory from './history';

const token = localStorage.getItem('Token');

const router = new Navigo('/');
const app = el('div#app');


// Установка хедера
setChildren(window.document.body, [createHeader(router), app]);

// Переход между адресами
router.on('/', () => {
  setChildren(app, createAuthorization(router));
})

// if (!token) {
//   router.on(atmAddress, () => {
//     setChildren(app, createAuthorization(router));
//   })

//   router.on(accountsListAddress, () => {
//     setChildren(app, createAuthorization(router));
//   })

//   router.on(currencyAddress, () => {
//     setChildren(app, createAuthorization(router));
//   })


//   router.on(`${accountAddress}/:id`, ({ data: { id } }) => {
//     setChildren(app, createAuthorization(router));
//   });
// }
// else {
router.on(atmAddress, () => {
  setChildren(app, createAtms());
})

router.on(accountsListAddress, () => {
  setChildren(app, accountsList(router));
})

router.on(currencyAddress, () => {
  setChildren(app, createСurrency());
})


router.on(accountAddress + '/:id', ({ data: { id } }) => {
  setChildren(app, createAccoutn(router, id));
});
router.on(balanceHistoryAddress + '/:id', ({ data: { id } }) => {
  setChildren(app, createHistory(router, id));
});
// }




router.resolve();
