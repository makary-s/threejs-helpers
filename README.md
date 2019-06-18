# Что это?
Набор инструментов для three.js.

### [Hoverer](#Hoverer-1) 
  
Определяет, когда мышь наведена на объект. Учитывает препятствия. Возможна привязка событий.
### [Visibiler](#Visibiler-1) 

Определяет находится ли точка в области видимости камеры. Учитывает препятствия. Возможна привязка событий.

### [Highlighter](#Highlighter-1) 
Подсвечивает объекты.
### [toScreenPosition](#toScreenPosition-1) 
Переводит точку в пространстве сцены в координаты canvas.
### [mapPosition](#mapPosition-1) 

Переводит нормализированный вектор в координату в пространстве ограничивающего параллелепипеда объекта.

# Краткое руководство

## Hoverer
<sup>[[к оглавлению]](#Что-это)</sup>

Определяет, когда мышь наведена на объект. Учитывает препятствия. Возможна привязка событий.

### Начальная настройка
Создаем экземпляр `Highlighter`, указав dom-элемент и камеру:
```js
var hoverer = new Hoverer(renderer.domElement, camera);
```

Отслеживаем события мыши и подключаем анимационный цикл:
```js
renderer.domElement.addEventListener('mousemove', event => {
  hoverer.setMouse(event.clientX, event.clientY); // <-
});

function animate() {
  requestAnimationFrame( animate );
  hoverer.update();  // <-
  renderer.render();
}
```
### Работа с Hoverer
Указываем объекты, которые хотим отслеживать:
```js
hoverer.add(obj1);  // отслеживается: [obj1]
hoverer.add([obj2, obj3]);  // отслеживается: [obj1, obj2, obj3]

hoverer.clear(); // отслеживается: []
```
Определяем события:
```js
// Когда курсор был наведен на объект
hoverer.onMouseOver(obj => {
  console.log('Курсор наведен на ' + obj.name);
  highlighter.add(obj);  // выделяем с помощью Highlighter
});

// Когда курсор уходит с наведенного объекта
hoverer.onMouseOut(() => {
  highlighter.clear();   // снимаем выделение
});
```

## Visibiler
<sup>[[к оглавлению]](#Что-это)</sup>

Определяет находится ли точка в области видимости камеры. Учитывает препятствия. Возможна привязка событий.

### Начальная настройка
Создаем экземпляр `Visibiler`, указав камеру:
```js
var visibiler = new Visibiler(g.camera);
```
Включаем в анимационный цикл:
```js
function animate() {
  requestAnimationFrame( animate );
  visibiler.update();  // <-
  renderer.render();
}
```
### Работа с Visibiler
Указываем объекты, которые будет учитываться при расчете визуальных препятствий:
```js
visibiler.addObstacles(obj1); // преграды: [obj1]
visibiler.addObstacles([obj2, obj3]); // преграды: [obj1, obj2, obj3]

visibiler.clearObstacles([obj2, obj3]); // преграды: []
```

Чтобы проверить видимость точки используем метод `check`, который вернет `true` или `false`:
```js
var isVisible = visibiler.check(vector)
var isVisible = visibiler.check(vector, [obj1])
```

Чтобы привязать события к конкретной точке используем метод `addChecker`, в который передаем эту точку и функции событий. Опционально можно указать объекты, которые должны быть проигнорированны при расчете видимости этой точки.
```js
visibiler.addChecker(
  vector3, // точка
  function() { // когда точка становится видимой
    console.log('vector3 is visible');
  },
  function() { // когда точка становится не видимой
    console.log('vector3 is hidden');
  },
  [parentObj] // массив с игнорируемыми объектами
)

// так же можно передать конфигурационный объект
var checker = {
  position: vector3,
  onVisible: () => {
    console.log('vector3 is visible');
  },
  onHidden: () => {
    console.log('vector3 is hidden');
  },
  ignored: [parentObj]
}
visibiler.addChecker(checker);
```
## Highlighter
<sup>[[к оглавлению]](#Что-это)</sup>

Подсвечивает объекты.

### Начальная настройка
Создаем экземпляр `Highlighter`, указав dom-элемент, сцену и камеру:
```js
var highlighter = new Highlighter(renderer.domElement, scene, camera);
```
Подключаем `highlighter.pass` к экземпляру *EffectComposer* ([подробнее](https://github.com/vanruesc/postprocessing)), настраиваем анимационный цикл:
```js
var composer = new THREE.EffectComposer(g.renderer);

var renderPass = new THREE.RenderPass(g.scene, g.camera);
composer.addPass(renderPass);

composer.addPass(highlighter.pass);  // <-

function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
animate();
```
### Работа с Highlighter
Теперь, чтобы выделить объекты можно использовать методы `add` или `set`:
```js
// добавляем объекты к списку выделенного
highlighter.add(obj1);  // выделены: [obj1]
highlighter.add([obj2, obj3]); // выделены: [obj1, obj2, obj3]

// заменяем список выделенного указанными объектами
highlighter.set(obj4);  // выделены: [obj4]
highlighter.set([obj1, obj2]);  // выделены: [obj1, obj2]
```
Чтобы снять выделение используется метод `clear`:
```js
highlighter.clear(); // выделены: []
```
Определить стиль выделения можно передав конфигурацию в метод `updateStyle`. В примере показанна полная конфигурация (вместо любого не указанного свойства будет использоваться значение по умолчанию):
```js
highlighter.updateStyle({
  blending: THREE.SubtractiveBlending,
  visibleEdgeColor: '#38ff38', 
  hiddenEdgeColor: '#daedda',
  pulsePeriod: 1.5,
  edgeStrength: 8, 
  edgeThickness: 1,
  texturePath: null  // 'textures/pattern.jpg'
});
```

## toScreenPosition
<sup>[[к оглавлению]](#Что-это)</sup>

Переводит точку в пространстве сцены в координаты canvas:
```js
var screenPosition = toScreenPosition(vector3, camera, renderer);
var console.log(screenPosition); // {x: 123, y: 456}
```

## mapPosition
<sup>[[к оглавлению]](#Что-это)</sup>

Переводит нормализированный вектор в координату в пространстве ограничивающего параллелепипеда объекта. Принимает объект (`Object3D`) и нормализованный вектор в виде массива. Возвращает Vector3.
```js
// центр объекта
var position = mapPosition(obj, [0.5, 0.5, 0.5]);

// верхняя левая точка объекта
var position = mapPosition(obj, [0, 1, 0]);
```