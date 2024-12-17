import { Router } from "express";
import productsRouter from "./products.routes.js";
import cartsRouter from "./carts.routes.js";
import purchaseRouter from "./purchase.routes.js";  // Importamos las rutas de compra

const router = Router();

router.use("/products", productsRouter);
router.use("/carts", cartsRouter);
router.use("/purchase", purchaseRouter);  // Agregamos la ruta para finalizar compras

export default router;

