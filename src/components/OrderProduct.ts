import { PaymentType, IOrder } from "../types";
import { ensureElement } from "../utils/utils";
import { EventEmitter } from "./base/events";
import { Form } from "./common/Form";

export class OrderProduct extends Form<IOrder> {
    card: HTMLButtonElement;
    cash: HTMLButtonElement;
    private _payment: PaymentType; 

    constructor(container: HTMLFormElement, evt: EventEmitter, formType: 'order') {
        super(evt, container, formType);

        this.card = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
        this.cash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);

        this.card.addEventListener('click', () => {
            this.payment = 'card';
            this.onInputChange('payment', 'card');
        });
        
        this.cash.addEventListener('click', () => {
            this.payment = 'cash';
            this.onInputChange('payment', 'cash');
        });
    }

    set address(value: string) {
        const inputElement = this.container.querySelector<HTMLInputElement>('.form__input[name=address]');
        if (inputElement) {
            inputElement.value = value;
        }
    }

    set payment(value: PaymentType) {
        this._payment = value; 
        this.toggleClass(this.card, 'button_alt-active', value === 'card');
        this.toggleClass(this.cash, 'button_alt-active', value === 'cash');
    }

    get payment(): PaymentType {
        return this._payment; 
    }

    clear() {
        this.address = '';
        this.payment = 'card'; 
        this.errors = [];
        this.valid = false;
    }
}

export class OrderContactProduct extends Form<IOrder> {
    constructor(container: HTMLFormElement, evt: EventEmitter, formType: 'contacts') {
        super(evt, container, formType);
    }

    set phone(value: string) {
        const phoneInput = this.container.querySelector<HTMLInputElement>('[name="phone"]');
        if (phoneInput) {
            phoneInput.value = value;
        }
    }

    set email(value: string) {
        const emailInput = this.container.querySelector<HTMLInputElement>('[name="email"]');
        if (emailInput) {
            emailInput.value = value;
        }
    }

    clear() {
        this.phone = '';
        this.email = '';
        this.errors = [];
        this.valid = false;
    }
}