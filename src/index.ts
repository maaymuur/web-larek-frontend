import './scss/styles.scss';
import { App } from './components/app';
import { Page } from './components/Page';
import { PaymentType, IProduct, IOrder } from './types';
import { larekApi } from './components/larekApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { Success } from './components/ Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductView } from './components/Product';
import { OrderProduct } from './components/OrderProduct';
import { OrderContactProduct } from './components/OrderProduct';

// Инициализация шаблонов
const itemTemp = ensureElement<HTMLTemplateElement>('#card-preview');
const itemsListTemp = ensureElement<HTMLTemplateElement>('#card-catalog');
const itemsBasketTemp = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemp = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemp = ensureElement<HTMLTemplateElement>('#order');
const orderContactFormTemp = ensureElement<HTMLTemplateElement>('#contacts');
const successTemp = ensureElement<HTMLTemplateElement>('#success');

// Инициализация API и событий
const api = new larekApi(CDN_URL, API_URL);
const events = new EventEmitter();

// Инициализация объектов приложения
const appData = new App(events);
const page = new Page(events, document.body);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const payForm = new OrderProduct(cloneTemplate(orderFormTemp), events, 'order');
const payContactForm = new OrderContactProduct(cloneTemplate(orderContactFormTemp), events, 'contacts');
const basket = new Basket(cloneTemplate(basketTemp), events);
const complete = new Success(cloneTemplate(successTemp), events);

// Получение списка товаров и установка их в приложение
api.getListItems()
    .then(appData.setProductList.bind(appData))
    .catch(err => console.log('Error fetching products:', err));

// Обработчики событий
events.on('basket:change', () => {
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map((id, index) => {
        const item = appData.products.find(item => item.id === id);
        if (!item) return;
        const product = new ProductView(cloneTemplate(itemsBasketTemp), {
            onClick: () => appData.removeSomethingFromBasket(item)
        });
        return product.render({
            index: String(index + 1),
            title: item.title,
            price: item.price
        });
    }).filter(Boolean);
    basket.total = appData.basket.total;
});

events.on('basket:open', () => {
    modal.render({ content: basket.render() });
});

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
    modal.render({ content: product.render(item) });
});

events.on('order:change', (data: { field: keyof IOrder; value: string }) => {
    appData.orderForm(data.field, data.value);
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;

    // Преобразуем ошибки в массив строк
    const orderErrors = Object.values({ address, payment }).filter(Boolean) as string[];
    const contactErrors = Object.values({ phone, email }).filter(Boolean) as string[];

    payForm.valid = !(address || payment);
    payContactForm.valid = !(email || phone);

    payForm.errors = orderErrors;
    payContactForm.errors = contactErrors;
});


events.on('order:open', () => {
    payForm.clear(); // Очистка формы заказа
    modal.render({
        content: payForm.render({ payment: 'card', address: '', valid: false, errors: [] })
    });
});

events.on('order:submit', () => {
    payContactForm.clear(); // Очистка формы контактов
    modal.render({
        content: payContactForm.render({ email: '', phone: '', valid: false, errors: [] })
    });
});

events.on('contacts:submit', () => {
    if (!appData.validation()) {
        return;
    }

    appData.order.items = appData.basket.items;
    appData.order.total = appData.basket.total;

    if (appData.order.items.length === 0) {
        console.error("No items in order.");
        return;
    }

    if (appData.order.total <= 0) {
        console.error("Invalid total amount:", appData.order.total);
        return;
    }

    api.orderItems(appData.order)
        .then(result => {
            appData.removeEverythingFromBasket();
            complete.summ = result.total;
            modal.render({ content: complete.render({ total: result.total, id: result.id }) });
            page.counter = 0;
            basket.items = [];
            basket.total = 0;

            // Очищаем формы после успешного завершения заказа
            payForm.clear();
            payContactForm.clear();

            // Сброс состояния валидации и данных формы
            payForm.render({ payment: 'card', address: '', valid: false, errors: [] });
            payContactForm.render({ email: '', phone: '', valid: false, errors: [] });

        })
        .catch(err => console.log('Error sending order:', err));
});


events.on('modal:open', () => {
    page.block = true;
});

events.on('modal:close', () => {
    page.block = false;
});

events.on('items:change', (items: IProduct[] | IProduct) => {
    if (Array.isArray(items)) {
        page.catalog = items.map(item => {
            const product = new ProductView(cloneTemplate(itemsListTemp), {
                onClick: () => events.emit('preview:change', item)
            });
            return product.render(item);
        });
    } else {
        const product = new ProductView(cloneTemplate(itemsListTemp), {
            onClick: () => events.emit('preview:change', items)
        });
        page.catalog = [product.render(items)];
    }
});

events.on('order:result', () => {
    modal.close();
});
