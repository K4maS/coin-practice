import { el, setChildren } from "redom";
import { Account } from "./classes";
import { currencyTransfer, getAccount } from './requests'
import { accountsListAddress } from "./addresses";


const token = localStorage.getItem('Token');




// Сборка и вывод странциы
export default function createAccoutn(router, id) {
  const accountBlock = el('div.account');
  const spinner = el('span.spinner.spinner-border', {
    role: 'status', 'aria-hidden': 'true',
    style: { position: 'absolute', top: 'center', left: 'center' }
  });

  setChildren(accountBlock, spinner);
  getAccount(id, token).then(res => {
    let account = res.payload;
    account = new Account(account);
    console.log('account', account)
    const container = el('div.container');


    setChildren(accountBlock, container);
    setChildren(container, [createTopOfAccount(router, account), createBlocks(router, account)]);
  }
  );


  return accountBlock
}

// Создание верхнего элемента страницы
function createTopOfAccount(router, account) {
  const topBlock = el('div.account__top');
  const accountTitle = el('h1.account__title.title', 'Просмотр счета');
  const createBtn = el('a.btn.btn-primary', {
    href: accountsListAddress,
    onclick(event) {
      event.preventDefault();
      router.navigate(event.target.getAttribute('href'));
      const btnsBtns = document.querySelectorAll('.nav__btn');
      btnsBtns[1].classList.add('disabled');
    }
  }, "Вернуться назад");
  let serviceBlock = el('.account__service', [accountTitle, createBtn]);
  let accountId = el('h3.account__id', `№ ${account.accountId}`);
  let accountBalanceText = el('span.account__balance-text', `Баланс`);
  let accountBalance = el('span.account__balance', `${account.formattedBalance} ₽`);
  let balanceBlock = el('.account__balance-block', [accountBalanceText, accountBalance]);
  let mainInfoBlock = el('.account__main-info', [accountId, balanceBlock]);

  setChildren(topBlock, [serviceBlock, mainInfoBlock])

  return topBlock;
}

function createBlocks(router, account) {

  const mainBlock = el('.account__main', [account.transaction(), account.balanceDynamics(router), account.history(router)]);

  return mainBlock;
}
