// repositories/UserRepository.js
import User from '../models/user.model.js';

export const createUser = async ({ first_name, last_name, email, age, password, role = 'user' }) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('El correo ya está registrado');
    }

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(error.message || 'Error al crear el usuario');
  }
};

export const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error('Error al obtener el usuario');
  }
};


