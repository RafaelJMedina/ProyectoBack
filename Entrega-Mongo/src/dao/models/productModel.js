import mongoose from "mongoose";

const productCollection = "products";

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    quantity: Number,
    code: String,
    price: Number,
    stock: Number,
    category: String
})

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;