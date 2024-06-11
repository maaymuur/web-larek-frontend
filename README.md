# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
<<<<<<< HEAD
- src/scss/styles.scss — корневой файл стилей
=======
- src/styles/styles.scss — корневой файл стилей
>>>>>>> 59bbabd51aababad16dc6a4751c9b8af4ff4c37f
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
<<<<<<< HEAD
## Данные и типы, используемые в приложении

Товар

```
export interface IProduct{
    id:string;
    description:string;
    image:string;
    title:string;
    category:string;
    price:number | null;
}


Заказ

```
export interface IOrder{
    id:string;
    payment:string;
    email:string;
    phone:number;
    address:string;
    total:number;
    items:IProduct[];
}


```
Ошибки в форме

export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}

```
Интерфейс хранения массива карточек товаров

```
export interface IProductData{
    items:IProduct[];
    getProduct(productId:string):IProduct; 
}


Данные товара, используемые просто в карточках товаров на главной странице

```
export type TProductInfo = Pick<IProduct,  "image" | "title" | "category" | "price">
 
Данные товара, используемые в модальном окне детального изучения карточки 

export type TProductModalInfo = Pick<IProduct, "description" | "image" | "title" | "category" | "price">

Данные заказа, используемые в модальном окне заполнения иформации покупки: адрес и оплата

export type TOrderModalPaymentAddress = Pick<IOrder, "payment"|"address">

Данные заказа, используемые в модальном окне заполнения иформации покупки: имэил и номер телефона

export type TOrderModalEmailPhone = Pick<IOrder, "email"|"phone">

Полный список даннх заказа:

export type TOrderInfo = Pick<IOrder, "email"|"phone"|"payment"|"address">

```

 ## Архитерктура приложения  

 Код приложения разделен на слои согласно парадигме MVP:
 - слой представления, отвечает за отображение данных на странице
 -слой данных, отвечает за хранение и изменение данных
 -презентер, отвечает за связь представления и данных

  ### Базовый код

#### Класс API

Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов. Методы:

- get(uri: string) - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- post(uri: string, data: object, method: ApiPostMethods = 'POST') - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- handleResponse(response: Response) - защищенный метод, в случае успеха выполнения запроса возвращает объект в виде json. В случае неуспеха - статус и текст ошибки. Принимает в параметрах Response

#### Класс EventEmmiter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом описаны интерфейсом  `IEvents`
-`on` - подписка на событие 
-`emit` - инициализация события
-`trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс Component
Базовый класс для представлений. В конструкторе принимает элемент разметки, который будет заполняться данными.

Основные методы:

- setText(element: HTMLElement, value: unknown) - установить текст элементу
- setImage(element: HTMLImageElement, src: string, alt?: string) - установить изображение элементу с альтернативным текстом (если он передан)
- render(data?: Partial<T>) - возвращает элемент с заполненными данными. Принимает необязательный параметр data с полями указанного ранее типа данных. (данные могут быть частичными)


#### Класс Model
Родительский класс модели данных, работает с дженериками

Конструктор:

- constructor(data: Partial<T>, protected events: IEvents) - принимает данные выбранного типа и экземпляр IEvents для работы с событиями

Основные методы:

- emitChanges(event: string, payload?: object) - сообщает, что модель изменилась. Принимает на вход событие и данные, которые изменились

#### Класс ProductsData

Класс отвечает за хранение данных карточек .\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- products: IProduct[] - массив объектов товаров
- basket: IProduct[] - массив товаров в корзине
- order: IOrder - заказ
- selectedProduct: string | null - id товара для отображения в модальном окне


Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setProducts - получаем товары для главной страницы
- selectProduct - выбор продукта для отображения в модальном окне
- addProductToBasket - добавление товара в корзину
- removeProductFromBasket - удаление товара из корзины
- getBasketProducts - получение товаров в корзине
- getTotalPrice - получение стоимости всей корзины
- clearBasket - очищаем корзину
- clearOrder - очищаем текущий заказ
- setOrderField - записываем значение в поле заказа
- validateOrder - валидация полей заказа и установка значений ошибок, если они есть

###Классы отображения

Интерфейс IModalInfo
Представляет содержимое модального окна

interface IModalInfo {
  content: HTMLElement - содержимое модального окна
}

####Класс Modal
Общий класс для модальных окон\

class Modal extends Component<IModalInfo> {
  closeButton: HTMLButtonElement - кнопка закрытия
  content: HTMLElement - содержимое модального окна
}
Конструктор принимает на вход HTMLElement и IEvents для работы с событиями

Основные методы:

set content - установить содержимое модального окна
open - открыть модальное окно, добавляя класс видимости к container и эмитируя событие modal:open.
close - закрыть модальное окно, удаляя класс видимости из container, очищает содержимое и эмитирует событие modal: close.

####Класс Form
Общий класс для работы с формами

Основные методы:

onInputChange - изменение значений полей ввода
set isButtonActive - активна ли кнопка отправки
set errors - установка текстов ошибок

####Класс BasketView
Отображение корзины в модальном окне, расширяет Modal

class BasketView extends Modal {
  basket: IProduct[] - список продуктов в корзине
  total: number | null - сумма покупок
}
Основные методы

set basket - установить список продуктов в корзине
set total - установить общую сумму продуктов в корзине

####Класс ProductView
Отображение продукта на главной странице

class ProductView extends Component<IProduct>{
  product: TProduct
}

#####Класс ProductViewModal
Отображение продукта в модальном окне

class ProductModalView extends Modal {
  product: IProduct
}

####Класс OrderFormView - форма для заказа

class OrderFormView extends Modal {
  private orderFields: Record<keyof IOrder, [value:string, error:string]> | null
  private buttonActive: Boolean
}

Основные методы\

- set title - установить заголовок
- set description - установить описание

Основные события\

- items:changed - изменение списка товаров
- basket:add-product - добавление товара в корзину
- basket:remove-product - удаление товара из корзины
- basket:create-order - оформление заказа
- basket:open - открытие корзины пользователя
- product:preview - открытие модалки с товаром
- form:errors-changed - показ(скрытие) ошибок формы
- order:open - открытие формы заказа
- order:clear - очистка формы заказа
- order:set-payment-type - выбор типа оплаты
- modal:open - открытие модалки
- modal:close - закрытие модалки