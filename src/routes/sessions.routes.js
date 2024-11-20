import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();

// Ruta para login
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.cookie('token', token, { httpOnly: true, secure: false }); // secure: true en producción
    res.json({ message: 'Inicio de sesión exitoso', token });
  }
);

// Ruta para obtener el usuario actual
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

// Ruta para hacer logout (eliminar el token)
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada' });
});

export default router;


