import { Router } from "express";
import { cartDao } from "../dao/mongo/cart.dao.js";
import { purchaseCart } from "../controllers/cartController.js";
import { roleAuth } from "../middlewares/roleAuth.middleware.js";

const router = Router();

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await cartDao.getAll();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartDao.getById(cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartDao.create();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartDao.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartDao.deleteProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vaciar un carrito
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const updatedCart = await cartDao.clearProductsToCart(cid);
    res.json({ message: "Carrito vaciado correctamente", updatedCart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para realizar una compra (ya existente)
router.post("/:cid/purchase", roleAuth("user"), purchaseCart);

export default router;


