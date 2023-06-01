import { Router } from 'express';
import __dirname from '../utils.js';
import ManagerAcces from '../dao/managers/ManagerAccess.js';


const PATH = __dirname + '/db/products.json';
const router = Router();
const managerAcces = new ManagerAcces();


export default router;