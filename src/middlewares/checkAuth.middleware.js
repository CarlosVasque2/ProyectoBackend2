import jwt from "jsonwebtoken";
import { response } from "express";

// Middleware para verificar el JWT
export const checkAuth = (req, res = response, next) => {
  // Obtenemos el token de las cookies
  const token = req.cookies.jwt;  

  // Si no hay token, retornamos un error 401 (No autorizado)
  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token" });
  }

  // Verificamos el token con la clave secreta
  jwt.verify(token, "tu_clave_secreta", (err, decoded) => {
    if (err) {
      // Si el token es inválido, retornamos un error 403 (Forbidden)
      return res.status(403).json({ message: "Token inválido" });
    }

    // Si el token es válido, lo decodificamos y lo asignamos a req.user
    req.user = decoded;  
    
    // Llamamos a next() para pasar a la siguiente función
    next();
  });
};
