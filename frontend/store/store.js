import { createStore } from 'redux';
const ADD_PRODUCT_TO_SALE = 'ADD_PRODUCT_TO_SALE'

function addProductToSale(product){
    return {type: ADD_PRODUCT_TO_SALE, product}
}

function rootReducer(prevState, action){
    if(action===ADD_PRODUCT_TO_SALE){
        return {...prevState, saleProducts: [...prevState.saleProducts, action.product]}
    }
    return prevState
}

const initialState = {
    saleProducts = [],
}

export const salesStore = createStore(
    accountingReducer, 
    initialState, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

