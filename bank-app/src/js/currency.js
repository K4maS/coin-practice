import { el, setChildren } from 'redom';
import {} from './requests';

export default function createСurrency() {
  const currency = el('div.currency');
  const container = el('div.container');
  const topBlock = el('div.currency__top');
  const currencyTitle = el('h1.currency__title.title', 'Валютный обмен');
  setChildren(topBlock, currencyTitle);
  const mapBlock = el('div.currency__map');
  setChildren(currency, container);
  setChildren(container, [topBlock, mapBlock]);

  return currency;
}
