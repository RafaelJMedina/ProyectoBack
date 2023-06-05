import { Router } from 'express';
import __dirname from '../utils.js';
import ManagerAcces from '../dao/managers/ManagerAccess.js';
import productModel from '../dao/models/productModel.js';

const PATH = __dirname + '../dao/db/products.json';
const router = Router();
const managerAcces = new ManagerAcces();

router.get('/products', async(req,res)=>{
    
    const {page = 1} = req.query;
    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate({},{limit:4, page, lean:true })
    const products = docs;
    res.render('products', {
        products,
        title: String,
        description: String,
        price: String,
        stock: Number,
        category: String,
        code: String,
        hasPrevPage,
        prevPage,
        hasNextPage,
        nextPage
    })
})

export default router;