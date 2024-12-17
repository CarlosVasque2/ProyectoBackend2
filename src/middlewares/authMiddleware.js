import jwt from "jsonwebtoken";
import { response } from "express";
import dotenv from "dotenv"; // Importar dotenv para cargar las variables de entorno

// Configurar dotenv para cargar las variables de entorno desde el archivo .env
dotenv.config();

// Middleware para verificar si el usuario está autenticado
export const checkAuth = (req, res = response, next) => {
  // Intentamos obtener el token desde las cookies
  const token = req.cookies.jwt;

  // Si no encontramos un token, respondemos con un error 401 (no autorizado)
  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token" });
  }

  // Verificamos el token usando la clave secreta almacenada en las variables de entorno
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Si el token es inválido, respondemos con un error 403 (prohibido)
      return res.status(403).json({ message: "Token inválido" });
    }

    // Si el token es válido, decodificamos y almacenamos la información del usuario en req.user
    req.user = decoded;

    // Continuamos con el siguiente middleware o función de la ruta
    next();
  });
};

