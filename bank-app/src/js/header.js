import { el, setChildren, setStyle } from 'redom';
import { loginAddress,accountsListAddress ,currencyAddress, atmAddress } from './addresses';
export default function createHeader(router) {
  const header = el('header.header');
  const container = el('div.container');

  const headerLogo = el('a.header__logo', { href: '#' }, 'Coin.');

  const headerNav = el('nav.nav.header__nav');
  const navList = el('ul.nav__list');

  const btnList = [];
  const btnSettings = [
    { title: 'Банкоматы', link: atmAddress},
    { title: 'Счета', link: accountsListAddress},
    { title: 'Валюта', link: currencyAddress},
    { title: 'Выйти', link: loginAddress },
  ]

  btnSettings.forEach((elem) => {
    const btn = el('a.btn.btn-light.nav__btn', {
      href: elem.link,
      onclick(event) {
        event.preventDefault();
        router.navigate(event.target.getAttribute('href'));
        const btnsBtns = document.querySelectorAll('.nav__btn');
        btnsBtns.forEach(elem => elem.classList.remove('disabled'));
        if (elem.link === document.location.pathname && '/' !== document.location.pathname) {
          btn.classList.add('disabled')
        }
        if ('/' === document.location.pathname) {
          navList.style.display = 'none';
          btnsBtns[1].classList.add('disabled');
          localStorage.setItem('Token', '')
        }
      }
    }, elem.title);
    if (elem.link === document.location.pathname && '/' !== document.location.pathname) {
      btn.classList.add('disabled')
    }
    if ('/' === document.location.pathname) {

      navList.style.display = 'none';
    }

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
