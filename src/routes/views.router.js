import express from "express";
import { productManager } from "../managers.js";
import { cartManager } from "../managers.js";

const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, query, status, cartId } = req.query;
        const productsData = await productManager.getProducts({ page, limit, sort, query, status });

        console.log(`Página ${productsData.page} de ${productsData.totalPages}:`, productsData.payload.length, "productos");

        res.render("home", {
            products: productsData.payload,
            totalPages: productsData.totalPages,
            currentPage: productsData.page,
            prevPage: productsData.prevPage,
            nextPage: productsData.nextPage,
            hasPrevPage: productsData.hasPrevPage,
            hasNextPage: productsData.hasNextPage,
            prevLink: productsData.hasPrevPage ? `/?page=${productsData.prevPage}&limit=${limit}` : null,
            nextLink: productsData.hasNextPage ? `/?page=${productsData.nextPage}&limit=${limit}` : null,
            cartId: cartId || null
        });
    } catch (error) {
        console.error("Error al recuperar los productos:", error);
        res.status(500).send({ message: "Error al recuperar los productos" });
    }
});


// Vista de producto detallada
viewsRouter.get("/products/:pid", async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).render("error", { message: "Producto no encontrado" });
        }
        res.render("productDetail", { product });
    } catch (error) {
        res.status(500).render("error", { message: "Error al recuperar el producto" });
    }
});

// Vista del carrito con productos populados
viewsRouter.get("/cart/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).render("error", { message: "Carrito no encontrado" });
        
        res.render("cart", { cart });
    } catch (error) {
        res.status(500).render("error", { message: "Error al recuperar el carrito" });
    }
});

export default viewsRouter;