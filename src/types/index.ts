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

export interface IErrors{
    error: string;
    email:string;
    phone:number | string;
    address:string;
    payment:string;
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
    'хард-скил'='hard_skills_btn',
    'софт-скилл'='soft_skills_btn',
    'другое'='another_btn',
    'дополнительно'='in_addition_btn',
    'кнопка'='button_btn'
}

export type PaymentType = 'card' | 'cash';
