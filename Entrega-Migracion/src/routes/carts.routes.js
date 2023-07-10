import { Router } from "express";
import { CartModel} from "../daos/models/cart.model.js";
import { ProductModel } from "../daos/models/product.model.js";
import { v4 as uuidv4} from "uuidv4";


const router = Router();

router.post("/",async(req,res)=>{
    try {
        const cartCreated = await CartModel.create({});
        res.send(cartCreated)
    } catch (error) {
        res.send(error.message)
    }
});
router.get("/",async(req,res)=>{
    try {
        const carts = await CartModel.find();
        res.send(carts)
    } catch (error) {
        res.send(error.message)
    }
});

router.put("/",async(req,res)=>{
    try {
        const {cartId, productId, quantity} = req.body;
        const cart = await CartModel.findById(cartId);
        cart.products.push({id:productId,quantity:quantity});
        cart.save();
        res.send("producto agregado")
    } catch (error) {
        res.send(error.message)
    }
});


router.post("/:cid/purchase",async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = CartModel.findById(cartId);
        if(cart){
            if(!cart.products.length){
                return res.send("Es necesario que agregue productos.")
            }
            const ticketProducts = [];
            const rejectedProducts = [];
            let total = 0;

            for (let i = 0; i < cart.products.length; i++) {
                const cartProduct = cart.products[i];
                const producDB = await ProductModel.findById(cartProduct.id);
                if(cartProduct.quantity <= producDB.stock){
                    ticketProducts.push({
                      productID: cartProduct.id,
                      price: cartProduct.price
                    })
                    total += cartProduct.quantity*producDB.price
                }else {

                }
            }
            const newTicket = {
                code:uuidv4(),
                purchase_datetime: new Date().toLocaleDateString(),
                amount: total,
                purchaser: req.user.email,
                products: ticketProducts
            }
            
            const ticketCreated = await ticketsModel.create(newTicket);
            CartModel.updateOne({_id:cartId},cart );
            res.send(ticketCreated)

        }else{
            res.send("El carrito no existe")
        }

    } catch (error) {
        res.send(error.message)
    }
});

export {router as cartsRouter}