import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getAllEstados, getEstado, getMunicipios, getParroquias } from "../controllers/venezuela.controller.js";

const router = Router();

//router.get("/estados/:id", /*authMiddleware([1, 2]),*/ getEstado);

router.get("/estados", getAllEstados);

router.get("/estados/:idEstado", /*authMiddleware([1, 2]),*/ getMunicipios);

router.get("/municipio/:idMunicipio", /*authMiddleware([1, 2]),*/ getParroquias);

//router.get("/estados/:idEstado/municipio/:idMunicipio/parroquia/:idParroquia", /*authMiddleware([1, 2]),*/ getParroquia);

export default router;
