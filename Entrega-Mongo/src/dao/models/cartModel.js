import mongoose from "mongoose";

const cartCollection = "carts";


const cartSchema = mongoose.Schema({
    products:{
        type:[{
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'products'
            },
            quantity: Number
        }],
        default: []  
    }
})

cartSchema.pre('find', function(){
    this.populete(products.products);
}
)

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;