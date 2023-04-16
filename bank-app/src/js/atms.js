import { el, setChildren } from 'redom';
import { getAtms } from './requests';
// import ContactMap from './ymaps';
// import init from './ymaps';


// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.


// ymaps.ready(init());


// Отрисовка странциы полностью
export default function createAtms() {
  // const mapScript = el('script', {
  //   src: 'https://api-maps.yandex.ru/2.1/?apikey=e1c817e9-6f4f-480f-a2e2-3343d4ba6b8e&lang=ru_RU',
  //   type: 'text/javascript',
  //   defer: 'defer',
  // });
  // window.document.head.append(mapScript);

  const atms = el('div.atms');
  const container = el('div.container');
  const topBlock = el('div.atms__top');
  const atmsTitle = el('h1.atms__title.title', 'Карта банкоматов');
  const mapBlock = el('div.atms__map#map');
  // setChildren(mapBlock, ContactMap())


  setChildren(topBlock, atmsTitle);

  setChildren(atms, container);
  setChildren(container, [topBlock, mapBlock]);

  return atms;
}




