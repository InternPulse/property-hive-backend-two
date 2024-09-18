import {Router} from "express";
import PropertyRoutes from "./api/v1/routes/propertyRoutes.js";


const router = Router()

router.use("/property", PropertyRoutes);

export default router;