import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import __dirname from './utils.js';



const DB = 'eshop';
const MONGO ='mongodb+srv://rafaeljmedina:<password>@cluster0.rwmqinj.mongodb.net/' + DB; 
const PORT = 8080;

const app = express();

mongoose.connect(MONGO)

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
    req.session.user = 'Active Session'
    res.send('Session set');
})

app.get('/test', (req,res)=>{
    res.send(req.session.user);
})


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(PORT, ()=>{ console.log(`El servidor está corriendo en el puerto ${PORT}`); });

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
