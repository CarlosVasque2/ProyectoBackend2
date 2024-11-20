import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Función para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validaciones básicas (puedes mejorarlas)
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Faltan datos en el formulario" });
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "El usuario ya existe" });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear el nuevo usuario
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save(); // Guardar el nuevo usuario en la base de datos
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el usuario", error });
  }
};

// Función para el login de un usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validar los datos del formulario
  if (!email || !password) {
    return res.status(400).json({ message: "Faltan datos en el formulario" });
  }

  // Buscar al usuario en la base de datos
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Credenciales incorrectas" });
  }

  // Verificar la contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Credenciales incorrectas" });
  }

  // Crear el JWT
  const token = jwt.sign({ userId: user._id, email: user.email }, "tu_clave_secreta", { expiresIn: "1h" });

  // Enviar el token como respuesta
  res.cookie("jwt", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" }); // Establecer el token en las cookies
  res.json({ message: "Login exitoso", token });
};
