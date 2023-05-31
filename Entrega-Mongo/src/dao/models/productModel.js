import mongoose from "mongoose";

const productCollection = "products";

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    }, 
    quantity:{
        type:Number,
        require:true
    },
    code:{
        type:String,
        require:true,
        unique:true
    },
    price:{
        type:String,
        require:true        
    },
    stock:{
        type:Number,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    cart:{
        type:Array,
        default:[]
    }

})

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;