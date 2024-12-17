// controllers/userController.js
import * as userRepository from '../repositories/userRepository.js';  // Importa el repositorio
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/user.dto.js';  // Importa el DTO

// Lógica para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;

  try {
    const newUser = await userRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    });

    // Utilizamos el DTO para sanitizar la respuesta
    const userDTO = new UserDTO(newUser);

    res.status(201).json({ message: 'Usuario creado con éxito', user: userDTO });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error al crear el usuario' });
  }
};

// Lógica para login (autenticación)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Utilizamos el DTO para sanitizar la respuesta
    const userDTO = new UserDTO(user);

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, user: userDTO });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Error en el inicio de sesión' });
  }
};


