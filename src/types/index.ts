export interface IProduct{
    id:string;
    description:string;
    image:string;
    title:string;
    category:string;
    price:number | null;
}

export interface IOrder{
    id:string;
    payment:string;
    email:string;
    phone:number;
    address:string;
    total:number;
    items:IProduct[];
}

export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}

export interface IProductData{
    items:IProduct[];
    getProduct(productId:string):IProduct; 
}

export interface IOrderData{
    getOrderInfo():TOrderInfo;
    setOrderInfo(userData:IOrder):void;
    checkOrderValidation(data:Record<keyof TOrderInfo,string>):boolean;
}

export type TProductInfo = Pick<IProduct,  "image" | "title" | "category" | "price">
export type TProductModalInfo = Pick<IProduct, "description" | "image" | "title" | "category" | "price">
export type TOrderModalPaymentAddress = Pick<IOrder, "payment"|"address">
export type TOrderModalEmailPhone = Pick<IOrder, "email"|"phone">
export type TOrderInfo = Pick<IOrder, "email"|"phone"|"payment"|"address">
