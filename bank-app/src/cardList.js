
import { el, setChildren } from 'redom';

export default function cardList() {
  const list = el('div.list');
  const container = el('div.container');
  createTop();
  setChildren(list, container);
  setChildren(container, createTop());


  return list;
}

function createTop() {
  const topBlock = el('div.list__top');
  const listTitle = el('h1.list__title.title', 'Ваши счета');
  const sort = el('select.list__sort', { name: 'sort' });
  const createBtn = el('button.btn.btn-primary.disabled', "Создать новый счёт");
  const sortList = [
    { title: 'Сортировка', value: '' },
    { title: 'По номеру', value: 'number' },
    { title: 'По балансу', value: 'balance' },
    { title: 'По последней транзакции', value: 'last-transaction' },]
  const options = [];
  sortList.forEach(element => {
    const option = el('option', { value: element.value }, element.title);
    options.push(option);
  });

  setChildren(sort, options);
  setChildren(topBlock, [listTitle, sort, createBtn])

  return topBlock;
}


class Account {
  constructor() {

  }
}
