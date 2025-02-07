import express from "express";
import {productManager} from "../managers.js";

//Instancia de router de express para manejar las rutas
const productsRouter = express.Router();

//GET "/"
productsRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const products = await productManager.getProducts(limit);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({message: "Error al recuperar los productos"});
    }
});

//GET "/:pid"
productsRouter.get("/:pid", async(req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado"});
});

//POST "/"
productsRouter.post("/", async(req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch(error){
        res.status(400).json({error: error.message});
    }
});
//PUT "/pid"

productsRouter.put("/:pid", async(req, res) => {
    const updateProduct = await productManager.updateProduct(req.params.pid, req.body);
    updateProduct ? res.json(updateProduct) : res.status(404).json({error: "Producto no encontrado"});
})

//DELETE "/:pid"
productsRouter.delete("/:pid", async(req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    deleted ? res.json({message: "Producto eliminado"}) : res.status(404).json({error: "Producto a eliminar no encontrado"})
})

export default productsRouter;