import { Router } from "express";

const router = Router();

router.get("/",(req,res)=>{
    res.render("home");
});

router.get("/registro",(req,res)=>{
    res.render("registro")
});

router.get("/login",(req,res)=>{
    res.render("login");
});

router.get("/forgot-password",(req,res)=>{
    res.render("forgotPassword");
});

router.get("/reset-password",(req,res)=>{
    const token = req.query.token;
    res.render("resetPassword",{token});
});

router.get("/perfil", (req,res)=>{
    res.send(`Bienvenido ${req.user.email} <a href="/">home</a>`);
});

router.get("/products", (req,res)=>{
    res.render("products");

});

export {router as viewsRouter};