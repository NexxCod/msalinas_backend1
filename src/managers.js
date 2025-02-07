import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";

const productManager = new ProductManager("./src/data/products.json");
const cartManager = new CartManager("./src/data/carts.json");

export { productManager, cartManager }; //