import { Router } from 'express';
import __dirname from '../utils.js';
import ManagerAcces from '../dao/managers/ManagerAccess.js';
import cartModel from '../dao/models/cartModel.js';


const router = Router();

const managerAcces = new ManagerAcces();


router.post('/', async(req, res) => {
    await managerAcces.crearRegistro('Alta carrito');
    const cart = req.body
    const result = await cartModel.create();
    res.send({result})
});

router.post('/:cid/product/:pid', async (req, res) => {
    await managerAcces.crearRegistro('POST');
    const cid = req.params.cid;

    const pid = req.params.pid;

    const respuesta = await cartModel.updateMany({_id:cid},{_id:pid});

    res.send({respuesta})
});

router.get('/', async(req, res) => {
    await managerAcces.crearRegistro('GET');
    const respuesta = await cartModel.find();

    res.send({respuesta})
})

router.get('/:cid', async(req, res) => {
    await managerAcces.crearRegistro('GET');
    const cid = (req.params.cid);

    const respuesta = await cartModel.findById({_id:cid});
    res.send({respuesta})
});

router.delete('/:pid', async (req, res)=>{
    await managerAcces.crearRegistro('Elimina un producto');
    const pid = req.params.pid;

    const result = await cartModel.deleteOne({_id:pid})
    res.send({result})
});

export default router;