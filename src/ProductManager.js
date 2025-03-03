import Product from "./models/Product.js"

class ProductManager {

    //getProducts
    // Obtener productos con paginación, filtros y ordenamiento
    async getProducts({ limit = 10, page = 1, sort, query, status }) {
        try {
            let filter = {};
    
            // Filtrar por categoría si se proporciona
            if (query) {
                filter.category = query;
            }
    
            // Filtrar por status solo si está definido en la consulta
            if (status !== undefined) {
                filter.status = status === "true"; // Convierte string "true" o "false" en booleano
            } else {
                filter.status = true; // Por defecto solo mostrar productos activos
            }

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}
            };

            const result = await Product.paginate(filter, options);
            return {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}` : null,
                nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}` : null
            };
        } catch (error) {
            throw new Error("Error al obtener productos");
        }
    }

    //getProductById
    // Obtener producto por ID
    async getProductById(id) {
        try {
            return await Product.findById(id);
        } catch (error) {
            return null;
        }
    }


    //addProduct
 // Agregar nuevo producto
 async addProduct({ title, description, code, price, stock, category, thumbnails = [], status = true }) {
    if (!title || !description || !code || !price || !stock || !category) {
        throw new Error("Todos los campos son obligatorios excepto thumbnails");
    }

    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
        throw new Error("El código del producto ya existe");
    }

    const newProduct = new Product({ title, description, code, price, stock, category, thumbnails, status });
    await newProduct.save();
    return newProduct;
}

    // Actualizar producto por ID
    async updateProduct(id, updates) {
        try {
            return await Product.findByIdAndUpdate(id, updates, { new: true });
        } catch (error) {
            return null;
        }
    }


     // Eliminar producto por ID (marcar status como false en lugar de borrarlo)
     async deleteProduct(id) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, { status: false }, { new: true });
            return updatedProduct ? true : false;
        } catch (error) {
            return null;
        }
    }
}

export default ProductManager