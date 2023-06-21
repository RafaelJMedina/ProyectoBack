import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';

import __dirname from './utils.js';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewRouter from './routes/views.router.js';

import productModel from './dao/models/productModel.js';
import userModel from './dao/models/userModel.js';
import cartModel from './dao/models/cartModel.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.listen(PORT, ()=>{ console.log(`El servidor está corriendo en el puerto ${PORT}`); });

const MONGO ='mongodb+srv://rafaeljesusmedina:PmlBAvVYhhTH5y74@cluster0.3zxlt6w.mongodb.net/?retryWrites=true&w=majority'; 
const connection = mongoose.connect(MONGO);

app.use(session({
store: new MongoStore({
        mongoUrl: MONGO,
        ttl:15
    }),
    secret: 'CoderSecret',
    resave: false,
    saveUninitialized:false
}))

app.get('/',(req,res)=>{
    res.render('login');
})

app.post('/login', (req, res)=>{
    const data = req.body;
    res.login('Coderlogin', data,{maxAge:10000}).send({status:'success', message:'login set'})
})



