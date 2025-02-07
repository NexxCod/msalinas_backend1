import fs from "fs";
import { nanoid } from "nanoid";

class ProductManager {
    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    //getProducts
    getProducts = async (limit) => {
        try {
            //Leemos el contenido del archivo y lo guardamos
            const data = await fs.promises.readFile(this.pathFile, 'utf-8');
            const products = JSON.parse(data);
            return limit ? products.slice(0, limit) : products;
        } catch (error) {
            // throw new getSystemErrorMap(`Error al leer el archvio de productos : ${error.message}`)
            console.log("error")
        }

    }

    //getProductById

    getProductById = async (id) => {
        //Obtengo y almaceno mis productos con método getProducts
        const products = await this.getProducts();
        //Busco por id
        return products.find((product) => product.id === id) || null;
    }


    //addProduct

    addProduct = async ({ title, description, code, price, stock, category, thumbnails = "" }) => {
        //Revisar campos ingresados
        if (!title || !description || !code || !price || !stock || !category) {
            throw new Error("Todos los campos son obligatorios excepto thumbnails")
        }
        //Obtener productos
        const products = await this.getProducts();
        if (products.some((product) => product.code === code)) {
            throw new Error("El código del producto ya existe");
        }
        const newProduct = {
            id: nanoid(),
            title,
            description,
            code,
            price,
            stock,
            category,
            status: true,
            thumbnails,
        };

        products.push(newProduct);
        await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2));
        return newProduct;
    }

    //updateProduct(id, updates)
    updateProduct = async (id, updates) => {
        const products = await this.getProducts();
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) return null;

        products[index] = {...products[index], ...updates};

        await fs.promises.writeFile(this.pathFile, JSON.stringify(products, null, 2))

        return products[index];
    }
    
    //deleteProductById

    deleteProduct = async (id) => {
        const products = await this.getProducts();
        const newProducts = products.filter((product) => product.id !== id);
        if (products.length === newProducts.length) return null;

        await fs.promises.writeFile(this.pathFile, JSON.stringify(newProducts, null, 2));
        return true;
    }

}

export default ProductManager