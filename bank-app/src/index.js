import 'babel-polyfill';
import 'bootstrap';
import { el, setChildren } from 'redom';
import createHeader from './header';
import createAuthorization from "./login";
import cardList from './cardList';
import Navigo from 'navigo';
import './style.scss';

const router = new Navigo('/');

const app = el('div#app');
setChildren(window.document.body, [createHeader(router), app]);

router.on('/', () => {
   setChildren(app, createAuthorization(router));
})

router.on('/card-list', () => {
  setChildren(app, cardList());
})


router.resolve();
