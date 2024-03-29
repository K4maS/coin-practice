import { el, router, setChildren } from "redom";
import { Account } from "./classes";
import { currencyTransfer, getAccount } from './requests'
import { accountAddress } from "./addresses";
import BackArrow from '../assets/images/svg/back-arrow.svg';

const token = localStorage.getItem('Token');


// Сборка и вывод странциы
export default function createHistory(router, id) {
  const accountBlock = el('div.history');
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
  const topBlock = el('div.history__top');
  const accountTitle = el('h1.history__title.title', 'Просмотр счета');
  const createBtn = el('a.btn.btn-primary', {
    href: accountAddress + '/' + account.accountId,
    onclick(event) {
      event.preventDefault();
      router.navigate(event.target.getAttribute('href'));
    }
  }, el('img', { src: BackArrow }), "Вернуться назад");
  let serviceBlock = el('.history__service', [accountTitle, createBtn]);
  let accountId = el('h3.history__id', `№ ${account.accountId}`);
  let accountBalanceText = el('span.history__balance-text', `Баланс`);
  let accountBalance = el('span.history__balance', account.formattedBalance);
  let balanceBlock = el('.history__balance-block', [accountBalanceText, accountBalance]);
  let mainInfoBlock = el('.history__main-info', [accountId, balanceBlock]);

  setChildren(topBlock, [serviceBlock, mainInfoBlock])

  return topBlock;
}

// Создание основного блока со статистиками
function createBlocks(router, account) {

  const mainBlock = el('.history__main', [account.balanceDynamics(router, 12), account.transactionsRatio(router, 12), account.history(router, 100)]);

  return mainBlock;
}
