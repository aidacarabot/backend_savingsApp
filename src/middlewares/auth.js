const User = require("../api/models/user");
const { verifyJwt } = require("../config/jwt");

const isAuth = async(req, res, next) => {
    try {
      const token = req.headers.authorization; // Obtener el token del encabezado de autorización
      const parsedToken = token.replace("Bearer ", ""); // Eliminar "Bearer " del token

      const { id } = verifyJwt(parsedToken); // Verificar el token y obtener el ID del usuario

      const user = await User.findById(id); //buscar el usurio

      user.password = null; // No enviar la contraseña en la respuesta por seguridad
      req.user = user;
      next(); // Continuar con la siguiente función middleware o ruta

    } catch (error) {
      return res.status(401).json("Unauthorized: Invalid token or user not found");
    };
};

module.exports = { isAuth };