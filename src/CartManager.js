import fs from "fs";
import { nanoid } from "nanoid";
import { productManager } from "./managers.js";

class CartManager {

    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    //getCarts
    getCarts = async () => {
        try {
            const data = await fs.promises.readFile(this.pathFile, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return []
        }
    }

    
    //getCartById
    getCartById = async (id) => {
        const carts = await this.getCarts();
        return carts.find((cart) => cart.id === id) || null;
    }

    
    //createCart
    createCart = async () => {
        const carts = await this.getCarts();
        const newCart = {id: nanoid(), products: []};
        carts.push(newCart);
        await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));
        return newCart;
    }

    //addProductToCart
    addProductToCart = async (cartId, productId) => {
        const carts = await this.getCarts()
        //verificar si existe carrito
        const cart = carts.find((cart) => cart.id === cartId);
        if (!cart) return null;

        //verificar si producto existe en products.json
        const productExists = await productManager.getProductById(productId);
        if(!productExists) return {error: "Producto no encontrado en la base de datos"};

        //Verificar si el producto ya está en el carrito

        const productIndex = cart.products.findIndex((product) => product.product === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({product: productId, quantity: 1})
        }

        await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, 2));

        return cart;
    }
}

export default CartManager;