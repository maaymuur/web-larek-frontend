import { IEvents } from "./base/events";
import { IProduct, IBasket, IOrder, PaymentType, IErrors } from "../types";

export class App {
    products: IProduct[];
    productModal: IProduct = null;
    basket: IBasket = {
        total: 0,
        items: []
    };
    order: IOrder = {
        email: '',
        phone: '',
        address: '',
        payment: 'card',
        total: 0,
        items: []
    };

    errors: Partial<IErrors> = {};

    constructor(protected evt: IEvents) {}

    setProductList(products: IProduct[]) {
        this.products = products;
        this.evt.emit('items:change', this.products);
    }

    productWindow(product: IProduct) {
        this.productModal = product;
        this.evt.emit('items:change', this.productModal);
    }

    ifInBasket(product: IProduct) {
        return this.basket.items.includes(product.id);
    }

    addToBasket(product: IProduct) {
        this.basket.items.push(product.id);
        this.basket.total += product.price;
        this.evt.emit('basket:change', this.basket);
    
        // Обновление заказа
        this.order.items = this.basket.items;
        this.order.total = this.basket.total;
    }
    removeEverythingFromBasket() {
        this.basket.items = [];
        this.basket.total = 0;
        this.evt.emit('basket:clear', this.basket);
    }

    removeSomethingFromBasket(product: IProduct) {
        this.basket.items = this.basket.items.filter(id => id !== product.id);
        this.basket.total -= product.price;
        this.evt.emit('basket:change', this.basket);
    
        // Обновление заказа
        this.order.items = this.basket.items;
        this.order.total = this.basket.total;
    }
    
    payTypeFunction(type: PaymentType) {
        this.order.payment = type;
    }

    orderForm(input: keyof IOrder, value: string | number | []) {
        if (input === "payment") {
            this.payTypeFunction(value as PaymentType);
        } else if (input === "email" || input === "address" || input === "phone") {
            this.order[input] = value as string;
        } else if (input === "total") {
            this.order[input] = value as number;
        } else if (input === "items") {
            this.order[input] = value as string[];
        }
        if (input === 'items') {
            this.order.total = this.basket.total; // Обновляю сумму заказа на основании корзины
        }
    
        this.validation();
    }
    
    
    validation() {
        this.errors = {};

        if (!this.order.payment) {
            this.errors.payment = "Необходимо выбрать способ оплаты";
        }
        if (!this.order.email) {
            this.errors.email = "Необходимо указать email";
        }
        if (!this.order.phone) {
            this.errors.phone = "Необходимо указать номер телефона";
        }
        if (!this.order.address) {
            this.errors.address = "Необходимо указать адрес";
        }

        // Генерация события с обновлёнными ошибками
        this.evt.emit('formErrors:change', this.errors);

        // Проверка, есть ли ошибки
        return Object.keys(this.errors).length === 0;
    }
}
