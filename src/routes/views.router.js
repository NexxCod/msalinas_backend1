import express from "express";
import { productManager } from "../managers.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
    try {

        const products = await productManager.getProducts();
        res.render("home", {products});
    } catch (error) {
        res.status(500).send({ message: "Error al recuperar los productos" });
    }
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render("realtimeproducts", {products});
    } catch (error) {
        res.status(500).send({ message: "Error al recuperar los productos" });
    }
});

export default viewsRouter;