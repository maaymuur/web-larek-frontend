import './scss/styles.scss';
import { App } from './components/app';
import { Page } from './components/Page';
import { PaymentType, IProduct, IOrder, IBasket, IErrors } from './types';
import { larekApi } from './components/larekApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Success } from './components/ Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductView } from './components/Product';
import { OrderProduct } from './components/OrderProduct';

// Инициализация шаблонов
const itemTemp = ensureElement<HTMLTemplateElement>('#card-preview');
const itemsListTemp = ensureElement<HTMLTemplateElement>('#card-catalog');
const itemsBasketTemp = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemp = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemp = ensureElement<HTMLTemplateElement>('#order');
const successTemp = ensureElement<HTMLTemplateElement>('#success');

// Инициализация API и событий
const api = new larekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Инициализация объектов приложения
const appData = new App(events);
const page = new Page(events, document.body);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const payForm = new OrderProduct(cloneTemplate(orderFormTemp), events);
const basket = new Basket(cloneTemplate(basketTemp), events);
const complete = new Success(cloneTemplate(successTemp), events);

// Обработчики событий
events.on('order:result', () => {
    appData.removeEverythingFromBasket();
    modal.close();
});

events.on('card:select', (item: IProduct) => {
    appData.productWindow(item);
});

events.on('items:change', (items: IProduct[] | IProduct) => {
    if (Array.isArray(items)) {
        // Если items является массивом, обновляю каталог
        page.catalog = items.map(item => {
            const product = new ProductView(cloneTemplate(itemsListTemp), {
                onClick: () => {
                    events.emit('preview:change', item); // Использую событие preview:change для открытия в модальном окне
                }
            });
            return product.render(item);
        });
    } else {
        // Если items не является массивом, обрабатываем его как одиночный объект
        const product = new ProductView(cloneTemplate(itemsListTemp), {
            onClick: () => {
                events.emit('preview:change', items); // Использую событие preview:change для открытия в модальном окне
            }
        });
        page.catalog = [product.render(items)];
    }
});


events.on('order:submit', () => {
    modal.render({
        content: payForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
    
    console.log('Form rendered'); //
});


// Получение списка товаров и установка их в приложение
api.getListItems()
    .then(appData.setProductList.bind(appData))
    .catch(err => console.log(err));

// Обработчик изменений ошибок формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { address, payment, phone, email } = errors;
    payForm.valid = !(address || payment || phone || email);
    payForm.errors = Object.values({address, payment, phone, email })
      .filter((i) => !!i)
      .join('; ');
});


// Обработчик изменений заказа
events.on('order:change', (data: { input: keyof IOrder; value: string }) => {
    appData.orderForm(data.input, data.value);
});


// Открытие формы заказа
events.on('order:open', () => {
    modal.render({
        content: payForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

// Отправка заказа
events.on('contacts:submit', () => {
    api.orderItems(appData.order)
        .then(result => {
            modal.render({
                content: complete.render({
                    total: result.total,
                    id: ''
                })
            });
        })
        .catch(err => console.log(err));
});


// Обработчик изменения предпросмотра товаров
events.on('preview:change', (item: IProduct) => {
    const product = new ProductView(cloneTemplate(itemTemp), {
        onClick: () => {
            if (appData.ifInBasket(item)) {
                appData.removeSomethingFromBasket(item);
                product.btnTitle = 'В корзину';
            } else {
                appData.addToBasket(item);
                product.btnTitle = 'Убрать из корзины';
            }
        }
    });
    product.btnTitle = appData.ifInBasket(item) ? 'Убрать из корзины' : 'В корзину';

    modal.render({
        content: product.render({
            title: item.title,
            description: item.description,
            image: item.image,
            price: item.price,
            category: item.category,
        })
    });
});



// Открытие корзины
events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

// Обработчик изменений в корзине
events.on('basket:change', () => {
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map((id, index) => {
        const item = appData.products.find(item => item.id === id);
        if (!item) return; // Проверка на случай отсутствия товара
        const product = new ProductView(cloneTemplate(itemsBasketTemp), {
            onClick: () => {
                appData.removeSomethingFromBasket(item);
            }
        });
        return product.render({
            index: String(index + 1),
            title: item.title,
            price: item.price
        });
    }).filter(Boolean); 
    basket.total = appData.basket.total;
});

// Обработчик открытия модального окна
events.on('modal:open', () => {
    page.block = true;
});

// Обработчик закрытия модального окна
events.on('modal:close', () => {
    page.block = false;
});
