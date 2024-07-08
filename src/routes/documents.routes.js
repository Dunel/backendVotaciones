import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/manual_usuario", (req, res) => {
  const pdfPath = path.join(__dirname, '..', 'pdf', 'MANUAL_DE_USUARIO.pdf');
  res.sendFile(pdfPath, (err) => {
    if (err) {
      res.status(500).send("Error al enviar el archivo: " + err.message);
    }
  });
});

export default router;