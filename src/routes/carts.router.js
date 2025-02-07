import express from "express";
import {cartManager} from "../managers.js";

const cartsRouter = express.Router();

//POST "/" Crear carrito
cartsRouter.post("/", async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

//GET "/:cid" Buscar carrito por id
cartsRouter.get("/:cid", async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    cart ? res.json(cart) : res.status(404).json({error: "Carrito no encontrado"});
})

//POST "/:cid/product/:pid" Agregar producto a carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    const updateCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    updateCart ? res.json(updateCart) :  res.status(404).json({error: "Producto no pudo agregarse. Carrito no encontrado"})
})
export default cartsRouter;