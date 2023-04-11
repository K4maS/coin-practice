import { el, setChildren } from 'redom';
export default function createHeader(router) {
  const header = el('header.header');
  const container = el('div.container');

  const headerLogo = el('a.header__logo', { href: '#' }, 'Coin.');

  const headerNav = el('nav.nav.header__nav');
  const navList = el('ul.nav__list');

  const btnAtms = el('a.btn.btn-light', { href: '#' }, "Банкоматы");
  const btnAccounts = el('a.btn.btn-light', { href: '/card-list' }, "Счета");
  const btnСurrency = el('a.btn.btn-light', { href: '#' }, "Валюта");
  const btnQuit = el('a.btn.btn-light', {
    href: '/', onclick(event) {
      event.preventDefault();
      router.navigate(event.target.getAttribute('href'))
    }
  }, "Выйти");

  const btnList = [];
  const btnSettings = [
    { title: 'Банкоматы', link: '' },
    { title: 'Счета', link: '/card-list' },
    { title: 'Валюта', link: '' },
    { title: 'Выйти', link: '/' },
  ]
  btnSettings.forEach((elem) => {
    const btn = el('a.btn.btn-light', { href: elem.link }, elem.title);
    const item = el('li.nav__item');
    setChildren(item, btn);
    btnList.push(item);
  });
  setChildren(navList, btnList);
  setChildren(headerNav, navList);
  setChildren(container, [headerLogo, headerNav]);
  setChildren(header, container);

  return header;
}
