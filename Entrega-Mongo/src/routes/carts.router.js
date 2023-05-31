import { Router } from 'express';
import __dirname from '../utils.js';
import ManagerAcces from '../dao/managers/ManagerAccess.js';
import cartModel from '../dao/models/cartModel.js';
import CartManagerMongo from '../dao/mongo/cartmanagerMongo.js';


const router = Router();

const cartManagerMongo = new CartManagerMongo();
const managerAcces = new ManagerAcces();


router.post('/', async(req, res) => {

    await managerAcces.crearRegistro('Alta carrito');

    const respuesta = await cartManagerMongo.createCart();
    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});

router.post('/:cid/product/:pid', async (req, res) => {

    await managerAcces.crearRegistro('POST');

    const cid = req.params.cid;
    const pid = req.params.pid;

    const respuesta = await cartManagerMongo.updateCart(cid, pid);
    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});

router.get('/', async(req, res) => {
    await managerAcces.crearRegistro('GET');

    const respuesta = await cartManagerMongo.getCarts();
    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
})

router.get('/:cid', async(req, res) => {
    await managerAcces.crearRegistro('GET');

    const cid = req.params.cid;
    const respuesta = await cartManagerMongo.getCart(cid);
    res.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});

export default router;