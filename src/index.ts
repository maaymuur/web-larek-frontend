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
import { View } from './components/Component';
import { ProductView } from './components/Product';
import { OrderProduct } from './components/OrderProduct';
import { Form } from './components/common/Form';

const itemTemp = ensureElement<HTMLTemplateElement>('#card-preview');
const itemsListTemp = ensureElement<HTMLTemplateElement>('#card-catalog');
const itemsBasketTemp = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemp = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemp = ensureElement<HTMLTemplateElement>('#order');
const successTemp = ensureElement<HTMLTemplateElement>('#success');

const api = new larekApi(API_URL, CDN_URL);
const events = new EventEmitter();


const appData = new App(events);
const page = new Page(events, document.body);
const modal = new Modal(ensureElement<HTMLElement>('.modal-container'),events);
const paymentForm = new Form(events, cloneTemplate(orderFormTemp));
const basket = new Basket(cloneTemplate(basketTemp), events);
const complete = new Success(cloneTemplate(successTemp), events);

events.on('order:result', () => {
    appData.removeEverythingFromBasket();
    modal.close();
})

events.on('card:select', (item: IProduct) => {
    appData.productWindow(item);
})
events.on('items:change', (items: IProduct[]) => {
    page.catalog = items.map(item => {
        const product = new ProductView(cloneTemplate(itemsListTemp),{
            onClick: () => {
                events.emit('card:select', item);
            }
        })
        return product.render(item);
    })
})

events.on('order:submit', () => {
    modal.render({
        content: paymentForm.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
    });
});

api.getListItems()

.then(appData.setProductList.bind(appData))
.catch(err => console.log(err));


events.on('formErrors:change', (errors: Partial<IOrder>) => {
    const { email, phone, address, payment } = errors;
    paymentForm.valid = !address && !payment;
    paymentForm.valid = !email && !phone;
    paymentForm.errors = Object.values({address, payment })
      .filter((i) => !!i)
      .join('; ');
    paymentForm.errors = Object.values({phone, email})
       .filter((i) => !!i)
       .join(': ');
});


events.on('order:change', (data: {input: keyof IOrder; value: string}) => {
  appData.orderForm(data.input, data.value);
})

events.on('order:open', () => {
    modal.render({
        content: paymentForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

events.on('contacts:submit', () => {
    api.orderItems(appData.order)
      .then(result => {
        modal.render({
            content: complete.render({
                total: result.total,
                id: ''
            })
        })
      })
      .catch(err => console.log(err))
} )

events.on('preview:change', (item:IProduct) => {
 const product = new ProductView(cloneTemplate(itemTemp), {
    onClick: () => {
        if(appData.ifInBasket(item)) {
            appData.removeSomethingFromBasket(item);
            product.btnTitle = 'В корзину';
        } else {
            appData.addToBasket(item);
            product.btnTitle = 'Убрать из корзины';
        }
    }
 })
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

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    })
});

events.on('basket:change', () => {
    page.counter = appData.basket.items.length;
    basket.items = appData.basket.items.map((id, index) => {
        const item = appData.products.find(item => item.id === id);

        const product = new ProductView(cloneTemplate(itemsBasketTemp), {
            onClick: () => {
                appData.removeSomethingFromBasket(item);
            }
        })
        return product.render({
            index: String(index + 1),
            title: item.title,
            price: item.price
        });
    })
    basket.total = appData.basket.total;
});

events.on('modal:open', () => {
    page.block = true;
});


events.on('modal:close', () => {
    page.block = false;
})

