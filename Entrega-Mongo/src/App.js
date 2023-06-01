import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import __dirname from './utils.js';
import chatRouter from './routes/chat.router.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/chat', chatRouter);

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
    req.session.user = 'Active Session'
    res.send('Session set');
})

app.get('/test', (req,res)=>{
    res.send(req.session.user);
})



