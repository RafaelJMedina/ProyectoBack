import { Router } from 'express';
import __dirname from '../utils.js';
import ManagerAcces from '../dao/managers/ManagerAccess.js';
import ProductManager from '../dao/fs/ProductManager.js';
import ProductManagerMongo from '../dao/mongo/ProductManagerMongo.js';
import productModel  from '../dao/models/productModel.js';

const PATH = __dirname + '/db/products.json';
const router = Router();

const managerAcces = new ManagerAcces();
const productManager = new ProductManager(PATH);
const productManagerMongo = new ProductManagerMongo();

//Busca todo los productos
router.get('/', async (req, res)=>{
    await managerAcces.crearRegistro('Consulta todo los productos');
    const result = await productModel.find();
    res.send({result})
});

//Busca producto por ID interno
router.get('/:pid', async (req, res)=>{
    await managerAcces.crearRegistro('Consutla el producto buscado');
      
    const pid = req.params.pid;
    const result = await productModel.find({_id:pid})
    res.send({result})
});

//Crea un producto
router.post('/', async (req, res)=>{
    await managerAcces.crearRegistro('Alta producto');
    const {title, description, quantity, code, price, stock, category} = req.body;

    if(!title || !description || !quantity || !code || !price || !stock || !category) {
        return res.status(400).send({
            error: 'Datos incompletos'
        })
    }

    const product = {
        title, description, quantity, code, price, stock, category
    }

    const result = await productModel.create(product)


    res.send({result})
});

//Actualiza un producto
router.put('/:pid', async (req, res)=>{
    await managerAcces.crearRegistro('Actualizo un producto');

    const pid = req.params.pid
    const newProduct = req.body;

    const result = await productModel.updateOne({_id:pid},{$set:newProduct})

    res.send({result})
});

//Elimina el producto
router.delete('/:pid', async (req, res)=>{
    await managerAcces.crearRegistro('Elimina un producto');
    const pid = req.params.pid;

    const result = await productModel.deleteOne({_id:pid})
    res.send({result})
});
 
export default router;