import express from "express";
import routes from "./routes/index.js";
import __dirname from "./dirname.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRoutes from "./routes/views.routes.js";
import { connectMongoDB } from "./config/mongoDB.config.js";
import passport from "passport";  
import session from "express-session";  
import cookieParser from "cookie-parser";  
import jwt from "jsonwebtoken";  
import authRoutes from "./routes/authRoutes.js"; 

// Configuración de Passport
import "./config/passport.js";  

const app = express();

connectMongoDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", handlebars.engine()); 
app.set("views", __dirname + "/views"); 
app.set("view engine", "handlebars"); 
app.use(express.static("public"));

// Configuración de cookies y sesión
app.use(cookieParser());  
app.use(session({
  secret: "mi_secreto",  
  resave: false,
  saveUninitialized: false,
}));

// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session()); 

// Middleware para verificar JWT
const checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;  
  
  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token" });
  }

  // Verificamos el token con la clave secreta
  jwt.verify(token, "tu_clave_secreta", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = decoded;  
    next();  
  });
};

// Rutas de la API
app.use("/api", routes);

// Rutas de autenticación
app.use("/api/auth", authRoutes);  

// Ruta de las vistas
app.use("/", viewsRoutes);

// Ruta protegida que usa el middleware checkAuth
app.use("/api/protected", checkAuth, (req, res) => {
  // Esta ruta está protegida por el middleware
  res.json({ message: "Ruta protegida", user: req.user });
});

const httpServer = app.listen(8080, () => {
  console.log("Servidor escuchando en el puerto 8080");
});

// Configuramos socket
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo usuario Conectado");
});



