import cartModel from "../models/cartModel.js ";

class CartManagerMongo{

    constructor(path){
        this.path = path;
    }

//Crear carrrito
    async createCart(){

        const cart = await cartModel.create({});
        
        return {
            code: 202,
            status: 'Success',
            message: cart
        };

    };
//Buscar carrito
    async getCart(cid){
        
        const cart = await cartModel.findOne({_id:cid});

        if(!cart){
            return {
                code: 400,
                status: 'Error',
                message: 'No se ha encontrado un cart con ese ID'
            };
        };

        return {
            code: 202,
            status: 'Success',
            message: cart.products
        };
    };
//Actualizamos el carrito
    async updateCart(cid, pid){

        const cart = await cartModel.findOne({_id:cid})
        const prodIndex = cart.products.findIndex(cprod => cprod._id === cid);
       
        if (prodIndex === -1){
            const product = {
                _id: pid,
                quantity: 1
            }
            cart.products.push(product);
        } 
        else {
            let total = cart.products[prodIndex].quantity;
            cart.products[prodIndex].quantity = total + 1;
        }

        const result = await cartModel.updateOne({_id:cid},{$set:cart})
        
        return {
            code: 202,
            status: 'Success',
            message: cart.products
        };

    };

//Eliminamos del carrito
async deleteProductCart(cid, pid){

    const cart = await cartModel.findOne({_id:cid})
    const prodIndex = cart.products.findIndex(cprod => cprod._id === cid);
   
    if (prodIndex === -1){
    } 
    else {
        
        cart.products.splice(prodIndex)
    }

    const result = await cartModel.updateOne({_id:cid},{$set:cart})
    
    return {
        code: 202,
        status: 'Success',
        message: cart.products
    };

};
//Buscar carritos
    async getCarts(){
        
        const carts = await cartModel.find();

        return {
            code: 202,
            status: 'Success',
            message: carts
        };
    };


}

export default CartManagerMongo;