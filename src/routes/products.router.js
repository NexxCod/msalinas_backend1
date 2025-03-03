import express from "express";
import {productManager} from "../managers.js";

//Instancia de router de express para manejar las rutas
const productsRouter = express.Router();

//GET "/"
productsRouter.get("/", async (req, res) => {
    try {
        const result = await productManager.getProducts(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

//GET "/:pid"
productsRouter.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        product ? res.json({ status: "success", payload: product }) 
                : res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

//POST "/"
productsRouter.post("/", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
//PUT "/pid"

productsRouter.put("/:pid", async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        updatedProduct ? res.json(updatedProduct) 
                       : res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

//DELETE "/:pid"
productsRouter.delete("/:pid", async (req, res) => {
    try {
        const deleted = await productManager.deleteProduct(req.params.pid);
        deleted ? res.json({ message: "Producto marcado como inactivo" }) 
                : res.status(404).json({ error: "Producto no encontrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default productsRouter;