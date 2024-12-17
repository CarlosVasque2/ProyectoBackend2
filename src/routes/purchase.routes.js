import { Router } from 'express';
import { finalizePurchase } from '../controllers/purchaseController.js';  // Importamos el controlador de compra

const router = Router();

// Ruta para finalizar compra
router.post('/', finalizePurchase);  // Finaliza la compra

export default router;
