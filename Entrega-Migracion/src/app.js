import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import MongoStore from "connect-mongo";
import{__dirname} from "./utils.js";
import path from "path";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { webRouter } from "./routes/web.routes.js";
import "./config/dbConnection.js";
import {Server} from "socket.io";
import { chatManagerMongo } from "./daos/managers/chatManagerMongo.js";
import { ChatModel} from "./daos/models/chat.model.js";
import { authRouter } from "./routes/auth.routes.js";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";
import {options} from "./config/option.js"; 
import { contactsRouter } from "./routes/contacts.routes.js";
import { addLogger } from "./middlewares/logger.js";

//SERVICE
const chatManager = new chatManagerMongo(ChatModel);

// EJECUTANDO SERVIDOR
export const port = options.server.port;
const app = express();
const httpServer = app.listen(port,()=>console.log(`Server listening on port ${port}`));

//SERVIDOR PARA WEBSOCKET
const socketServer = new Server(httpServer);

//MIDDLEWARS
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(addLogger)
httpServer.on('error', error => console.log(`Error in server ${error}`));

//CONFIGURACION DE SESSION
app.use(session({
    store: MongoStore.create({
        mongoUrl:options.mongoDB.url
    }),
    secret:options.server.secretSession,
    resave:false,
    saveUninitialized:false
}));

//CONFIGURACION DE PASSPORT
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//CONFIGURACION DE PLANTILLAS
app.engine(".hbs",handlebars.engine({extname: '.hbs'}));
app.set('views',path.join(__dirname, "/views"));
app.set("view engine", ".hbs");

//ROUTES
app.use(webRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/contacts", contactsRouter);

//CONFIGURACION DE SOCKET 
socketServer.on("connection",async(socketConnected)=>{
    console.log(`Nuevo cliente conectado ${socketConnected.id}`);
    const messages = await chatManager.getMessages();
    socketServer.emit("msgHistory", messages);
    //capturamos un evento del socket del cliente
    socketConnected.on("message",async(data)=>{
        //recibimos el msg del cliente y lo guardamos en el servidor con el id del socket.
        await chatManager.addMessage(data);
        const messages = await chatManager.getMessages();
        // messages.push({socketId: socketConnected.id, message: data});
        //Enviamos todos los mensajes a todos los clientes
        socketServer.emit("msgHistory", messages);
    });
});

//endpoint
app.get("/loggerTest", (req, res) =>{
    res.send("Logger Test")
})