import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";


const app = express();
//Puerto
const PORT = 8081;

//Habilitamos para recibir JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Endpoints
app.use("/api/products", productsRouter);

app.use("/api/cart", cartsRouter)

//Inicio al servidor y escucha al puerto definido
app.listen(PORT, ()=> console.log(`Servidor iniciado en: http://localhost:${PORT}`));