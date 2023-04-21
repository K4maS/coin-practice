import { el, setChildren } from 'redom';
import { getAtms } from './requests';
import ymaps from 'ymaps';

const token = localStorage.getItem('Token');

// Отрисовка странциы полностью
export default function createAtms() {


  const atms = el('div.atms');
  const container = el('div.container');
  const topBlock = el('div.atms__top');
  const atmsTitle = el('h1.atms__title.title', 'Карта банкоматов');
  const mapBlock = el('div.atms__map#myMap',);



  setChildren(topBlock, atmsTitle);

  setChildren(atms, container);
  setChildren(container, [topBlock, mapBlock]);
  mapInit(mapBlock);


  return atms;
}

// Инициализация карты
function mapInit(container) {
  // 'https://api-maps.yandex.ru/2.1/?apikey=e1c817e9-6f4f-480f-a2e2-3343d4ba6b8e&lang=en_US&load=Map'
  // "//api-maps.yandex.ru/2.1/?lang=en_US&load=Map"
  ymaps
    .load('//api-maps.yandex.ru/2.1/?apikey=e1c817e9-6f4f-480f-a2e2-3343d4ba6b8e&lang=en_US&load=Map')
    .then(maps => {
      const map = new maps.Map(container, {
        center: [55.8, 37.8],
        zoom: 7

      });

      const myGeoObject = new ymaps.GeoObject({
            geometry: {
              type: "Point",
              coordinates:[55.8, 37.8]
            }
          });
      map.geoObjects.add(myGeoObject);

      getAtms(token).then(res => {
        console.log(res.payload);
        let coordinatesArr = res.payload;
        let geoTagsArr = [];
        coordinatesArr.forEach(element => {
          geoTagsArr.push(new ymaps.GeoObject({
            geometry: {
              type: "Point",
              coordinates: [element.lat, element.lon]
            }
          }));

          map.geoObjects.add(geoTagsArr);
        }
        )

      });



    },

    )
    .catch(error => {
      console.log('Failed to load Yandex Maps', error);
    });


}

