import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import http from "http";
import viewsRouter from "./routes/views.router.js";
import { productManager } from "./managers.js";
import connectDB from "./data/db.js";
import dotenv from "dotenv";



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

//handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Puerto
const PORT = process.env.PORT || 8080;

//Habilitamos para recibir JSON y peticiones web
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Habilitamos la carpeta public
app.use(express.static("public"));


//Endpoints
app.use("/api/products", productsRouter);

app.use("/api/cart", cartsRouter)

app.use("/", viewsRouter);

//websockets
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("new-product", async (data) => {
        try {
            const newProduct = await productManager.addProduct(data);
            io.emit("ProductAdded", newProduct);
        } catch (error) {
            console.log("Error añandiendo el nuevo producto:", error);
        }
    });
    socket.on("ProductDeleted", async (id) => {
        try {
            const deleteProduct = await productManager.deleteProduct(id);
            if (deleteProduct) {
                io.emit("ProductRemoved", id); //Se notifica a clientes conectados;
            } else {
                console.log(`Producto con ID ${id} no encontrado.`);
            }
        } catch (error) {
            console.log("Error eliminando el producto:", error);
        }
    });
});

//Inicio al servidor y escucha al puerto definido
server.listen(PORT, ()=> console.log(`Servidor iniciado en: http://localhost:${PORT}`));