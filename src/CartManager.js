import { productManager } from "./managers.js";
import Cart from "./models/Cart.js"

class CartManager {

    //getCarts
    getCarts = async () => {
        try {
            return await Cart.find().populate("products.product");
        } catch (error) {
            return [];
        }
    }


    //getCartById
    getCartById = async (id) => {
        try {
            return await Cart.findById(id).populate("products.product").lean();
        } catch (error) {
            return null;
        }
    }


    //createCart
    createCart = async () => {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    //addProductToCart
    addProductToCart = async (cartId, productId, quantity = 1) => {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) return null;

            // Verificar si el producto existe en la BD
            const productExists = await productManager.getProductById(productId);
            if (!productExists) return { error: "Producto no encontrado en la base de datos" };

            // Verificar si el producto ya está en el carrito
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await cart.save();
            return cart;
        } catch (error) {
            return null;
        }
    }

    // Eliminar producto de un carrito
    removeProductFromCart = async (cartId, productId) => {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) return null;

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        } catch (error) {
            return null;
        }
    }

    // Vaciar un carrito
    clearCart = async (cartId) => {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) return null;

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            return null;
        }
    }

    // Actualizar cantidad de un producto en el carrito
    updateProductQuantity = async (cartId, productId, quantity) => {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) return null;

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } catch (error) {
            return null;
        }
    }

    // Reemplazar todo el carrito con un nuevo array de productos   
    updateCart = async (cartId, products) => {
        try {
            // Verificar si el carrito existe
            const cart = await Cart.findById(cartId);
            if (!cart) return null;
    
            // Validar que cada producto en la lista existe en la base de datos
            const validatedProducts = [];
            for (const item of products) {
                const productExists = await productManager.getProductById(item.product);
                if (!productExists) {
                    return { error: `Producto con ID ${item.product} no encontrado` };
                }
                validatedProducts.push({ product: item.product, quantity: item.quantity });
            }
    
            // Actualizar el carrito solo si todos los productos son válidos
            cart.products = validatedProducts;
            await cart.save();
    
            return cart;
        } catch (error) {
            return null;
        }
    }
}

export default CartManager;