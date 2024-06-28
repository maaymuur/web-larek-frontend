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
export interface IProduct {
    id: string - идентификатор продукта
    description: string - описание продукта
    image: string - урл на картинку
    title: string - название продукта
    category: ProductCategory - категория продукта
    price: number | null - цена продукта
}

Заказ

```
export interface IOrder {
    payment: OrderPayment - тип оплаты
    email: string - email покупателя
    phone: string - телефон покупателя
    address: string - адрес покупателя
    total: number - сумма заказа
    errors: FormErrors - ошибки формы
    items: IProduct[] - список продуктов в заказе
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
Категория продукта

```
type ProductCategory = "софт-скил" | "другое" | "дополнительное" | "кнопка" | "хард-скил"

```
Тип оплаты

```
type OrderPayment = "online" | "cash"

```

Отображение продукта на главной странице

```
type TProduct = Omit<IProduct, "description"> 

```

Продукт в корзине

type TBasketProduct = Pick<ProductView, "id" | "title" | "price"> 


```

Результат заказа

```

export interface IOrderResult {
    id: string - идентификатор заказа
    total: number - сумма заказа
}

```

Типы открытого модального окна

```

type AppStateModal = "product" | "basket" | "order"

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

Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.\

Основные методы, реализуемые классом описаны интерфейсом IEvents:
on(eventName: EventName, callback: (event: T) => void) - добавить обработчик на событие\
off(eventName: EventName, callback: Subscriber) - удалить обработчик с  события.\
emit(eventName: string, data?: T) - инициирует событие с передачей данных. \
onAll(callback: (event: EmitterEvent) => void) - слушать все события.\
offAll() - удалить все обработчики событий\
trigger(eventName: string, context?: Partial<T>) - возвращение функции генерации события при вызове



### Слой данных

#### Класс AppData
Класс отвечает за хранение данных приложения
Расширяет класс Model, Все поля приватные, доступ через методы
В полях класса хранятся следующие данные:\

products: IProduct[] - массив объектов продуктов (товаров)\
basket: IProduct[] - массив товаров в корзине\
order: IOrder - заказ\
selectedProduct: string | null - id товара для отображения в модальном окне\

Также класс предоставляет набор методов для взаимодействия с этими данными.\

setProducts - получаем товары для главной страницы\
selectProduct - выбор продукта для отображения в модальном окне\
addProductToBasket - добавление товара в корзину\
removeProductFromBasket - удаление товара из корзины\
getBasketProducts - получение товаров в корзине\
getTotalPrice - получение стоимости всей корзины\
clearBasket - очищаем корзину\
clearOrder - очищаем текущий заказ\
setOrderField - записываем значение в поле заказа\
validateOrder - валидация полей заказа и установка значений ошибок, если они есть\


#### Классы представлений
###Интерфейс IModalData
Представляет содержимое модального окна
```
interface IModalData {
  content: HTMLElement - содержимое модального окна
}
```

###Класс Modal

Общий класс для модальных окон

```
class Modal extends Component<IModalData> {
  closeButton: HTMLButtonElement - кнопка закрытия
  content: HTMLElement - содержимое модального окна
}
```


###Класс Form
Общий класс для работы с формами, расширяет Component\

Основные методы:

onInputChange - изменение значений полей ввода\
set isButtonActive - активна ли кнопка отправки\
set errors - установка текстов ошибок\

###Класс BasketView
Отображение корзины в модальном окне, расширяет Modal
```
class BasketView extends Modal {
  private basket: IProduct[] - список продуктов в корзине
  private total: number | null - сумма покупок
}
```
Основные методы\

set basket - установить список продуктов в корзине\
set total - установить общую сумму продуктов в корзине\


###Класс ProductView
Отображение продукта на главной странице
```
class ProductView extends Component<IProduct>{
  private product: TProduct
}
```
###Класс ProductViewModal
Отображение продукта в модальном окне
```
class ProductModalView extends Modal {
  private product: IProduct
}
```

###Класс OrderFormView - отображение формы заказа

```
class OrderFormView extends Modal {
  private orderFields: Record<keyof IOrder, [value:string, error:string]> | null
  private buttonActive: Boolean
}
```
###Класс OrderResultView

Отображение результата заказа. Расширяет Modal
```
class OrderResultView extends Modal {
  private description: string
  private title: string
}
```

Основные методы\

- set title - установить заголовок
- set description - установить описание

Основные события\
products:changed - изменение списка товаров
basket:add-product - добавление товара в корзину
basket:remove-product - удаление товара из корзины
basket:create-order - оформление заказа
basket:open - открытие корзины пользователя
product:preview - открытие модалки с товаром
form:errors-changed - показ(скрытие) ошибок формы
order:open - открытие формы заказа
order:clear - очистка формы заказа
order:set-payment-type - выбор типа оплаты
modal:open - открытие модалки
modal:close - закрытие модалки