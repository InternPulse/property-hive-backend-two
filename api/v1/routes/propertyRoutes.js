import {Router} from "express";
import { addProperty,updateProperty,deleteProperty} from "../controllers/propertyController.js"

const router = Router();


router.post("/", addProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
export default router;