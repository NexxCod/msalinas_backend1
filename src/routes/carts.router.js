import express from "express";
import {cartManager} from "../managers.js";

const cartsRouter = express.Router();

// Obtener carrito por ID con productos populados
cartsRouter.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        cart ? res.json(cart) : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

// Crear un nuevo carrito
cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

// Agregar producto a un carrito
cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid, quantity || 1);
        updatedCart ? res.json(updatedCart) : res.status(404).json({ error: "No se pudo agregar el producto" });
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

// Eliminar un producto del carrito
cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        updatedCart ? res.json(updatedCart) : res.status(404).json({ error: "Producto no encontrado en el carrito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar producto del carrito" });
    }
});

// Vaciar un carrito
cartsRouter.delete("/:cid", async (req, res) => {
    try {
        const clearedCart = await cartManager.clearCart(req.params.cid);
        clearedCart ? res.json({ message: "Carrito vaciado" }) : res.status(404).json({ error: "Carrito no encontrado" });
    } catch (error) {
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
});

// Actualizar cantidad de un producto en el carrito
cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        updatedCart ? res.json(updatedCart) : res.status(404).json({ error: "Producto no encontrado en el carrito" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar cantidad del producto" });
    }
});

// Reemplazar todo el carrito con un nuevo array de productos
cartsRouter.put("/:cid", async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);

        if (!updatedCart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        if (updatedCart.error) {
            return res.status(400).json({ error: updatedCart.error });
        }

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
});

export default cartsRouter;