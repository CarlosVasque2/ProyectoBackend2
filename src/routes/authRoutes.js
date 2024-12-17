import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js"; // Importamos los controladores
import { checkAuth } from "../middlewares/authMiddleware.js"; // Importamos el middleware de autenticación (checkAuth)

const router = Router();

// Ruta para el login
router.post("/login", loginUser);

// Ruta para el registro de usuario
router.post("/register", registerUser);

// Ruta protegida que solo puede ser accedida si el usuario está autenticado
router.get("/protected", checkAuth, (req, res) => {
  res.json({ message: "Ruta protegida, acceso permitido", user: req.user });
});

export default router;

