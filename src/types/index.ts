export interface IProduct{
    id?:string;
    description?:string;
    category?:string;
    title:string;
    price:number;
    image?:string;
    index?:string;
}

export interface IBasket{
    total:number;
    items:string[];
}



export interface IOrder{
    email:string;
    phone:number | string;
    address:string;
    payment:PaymentType;
    total: number;
    items: string[];
}

export interface ISuccessBuy{
    id:string;
    total:number;
}

export interface IErrors {
    error?: string;
    email?: string;
    phone?: string ;
    address?: string;
    payment?: string;
}


export interface IActions {
    onClick : ()=> void;
}

export interface IPageLarek {
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}

export enum Categories{
    "софт-скил"= "card__category_soft",
    "хард-скил"= "card__category_hard",
    "кнопка"= "card__category_button",
    "дополнительное"= "card__category_additional",
    "другое"= "card__category_other"
}

export type PaymentType = 'card' | 'cash';

