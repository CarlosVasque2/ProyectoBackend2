const roleMiddleware = (roles) => {
    return (req, res, next) => {
      const userRole = req.user.role; // Suponiendo que el usuario está autenticado y su rol es accesible
      if (roles.includes(userRole)) {
        next(); // Continúa si el rol es válido
      } else {
        res.status(403).json({ message: 'Acceso denegado' });
      }
    };
  };
  
  module.exports = roleMiddleware;
  