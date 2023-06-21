import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema= new mongoose.Schema({
    products:{
        type: [
            {
                id:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"products"
                },
                quantity:{
                    type:Number,
                    required:true,
                    default:1
                }
            }
        ],
        required:true,
        default:[]
    }
});

cartSchema.pre('find', function(){
    this.populate('products.id')
});

export const CartModel = mongoose.model(cartCollection,cartSchema);