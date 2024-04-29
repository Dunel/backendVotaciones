import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "../validations/login.schema.js";
import { prisma } from "../db.js";

export const Login = async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json(result.error.issues.map((err) => err.message));
      }
  
      const { cedula, password, nacionalidad } = result.data;
  
      const existingUser = await prisma.user.findUnique({
        where: {
          cedula,
          nacionalidad,
        },
      });
  
      if (!existingUser) {
        return res
          .status(401)
          .json({ message: "Cédula o contraseña incorrecta." });
      }
  
      const passwordMatch = await bcrypt.compare(password, existingUser.password);
  
      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: "Cédula o contraseña incorrecta." });
      }
  
      const token = jwt.sign(
        {
          fullname: existingUser.fullname,
          cedula: existingUser.cedula,
          role: existingUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      return res.status(200).json({
        token,
        cedula: existingUser.cedula,
        fullname: existingUser.fullname,
        role: existingUser.role,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error en el servicio." });
    }
  } 