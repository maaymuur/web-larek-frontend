export interface ICard{
    id:string;
    description:string;
    image:string;
    title:string;
    category:string;
    price:number;
}

export interface IUser{
    payment:string;
    email:string;
    phone:number;
    address:string;
}

export interface ICardsData{
    cards:ICard[];
    preview:string | null;
    getCard(cardId:string):ICard; 
}

export interface IUserData{
    getUserInfo():TUserInfo;
    setUserInfo(userData:IUser):void;
    checkUserValidation(data:Record<keyof TUserInfo,string>):boolean;
}

export interface ICartsData{
    total:ICard['price'];
    items:ICard['id'];
    addCard(card:ICard):void;
    deleteCard(cardId:string, playload:null):void;
}




export type TCardInfo = Pick<ICard,  "image" | "title" | "category" | "price">
export type TCardModalInfo = Pick<ICard, "description" | "image" | "title" | "category" | "price">
export type TCartModal = Pick<ICart, "total" | "items">
export type TUserModalPaymentAddress = Pick<IUser, "payment"|"address">
export type TUserModalEmailPhone = Pick<IUser, "email"|"phone">
export type TUserInfo = Pick<IUser, "email"|"phone"|"payment"|"address">