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
    res.status(res.code).send({
        status: res.status,
        message: res.message
    });
});

router.post('/:cid/product/:pid', async (request, response) => {
    await managerAcces.crearRegistro('POST');
    const cid = request.params.cid;

    const pid = request.params.pid;

    const respuesta = await cartManagerMongo.updateCart(cid, pid);

    response.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});

router.get('/', async(request, response) => {
    await managerAcces.crearRegistro('GET');
    const respuesta = await cartManagerMongo.getCarts();

    response.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
})
router.get('/:cid', async(request, response) => {
    await managerAcces.crearRegistro('GET');
    const cid = (request.params.cid);

    const respuesta = await cartManagerMongo.getCart(cid);

    response.status(respuesta.code).send({
        status: respuesta.status,
        message: respuesta.message
    });
});


export default router;