import dotenv from "dotenv";
dotenv.config(); // Cargar variables de entorno desde el archivo .env

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
import userRoutes from "./routes/userRoutes.js";  // Importa las rutas de usuario

// Configuración de Passport
import "./config/passport.js";  

// Requerimos Nodemailer
import nodemailer from "nodemailer";

const app = express();

// Conectar a MongoDB
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
  secret: process.env.SESSION_SECRET || "mi_secreto",  
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

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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

// Ruta de usuarios (agregada ahora)
app.use("/api/users", userRoutes);  // Ruta para los controladores de usuarios

// Ruta protegida que usa el middleware checkAuth
app.use("/api/protected", checkAuth, (req, res) => {
  res.json({ message: "Ruta protegida", user: req.user });
});

// Configuración de Nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  service: "gmail", // Usamos Gmail como servicio de correo
  auth: {
    user: process.env.EMAIL_USER,  
    pass: process.env.EMAIL_PASS,  
  },
});

// Función para enviar un correo de prueba
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  
    to: to,                       
    subject: subject,             
    text: text,                   
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
};

// Ejemplo de cómo usar la función de enviar correo
sendEmail("destinatario@example.com", "Prueba de correo", "Este es un correo de prueba enviado desde Node.js utilizando Nodemailer.");

const httpServer = app.listen(process.env.PORT || 8080, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT || 8080}`);
});

// Configuración de Socket.io
export const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");
});






