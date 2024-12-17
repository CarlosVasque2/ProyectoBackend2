// routes/userRoutes.js
import express from 'express';
import * as userController from '../controllers/userController.js';  // Importa el controlador

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', userController.registerUser);

// Ruta para login (autenticación)
router.post('/login', userController.loginUser);

export default router;


