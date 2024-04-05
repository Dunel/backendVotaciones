import jwt from "jsonwebtoken";

const authMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
      //console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Acceso no autorizado" });
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({ error: "Permiso denegado" });
      }

      req.user = decodedToken;

      next();
    } catch (error) {
      return res.status(401).json({ error: "Token inválido" });
    }
  };
};

export default authMiddleware;
