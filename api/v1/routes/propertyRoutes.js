import {Router} from "express";
import { addProperty,updateProperty,deleteProperty, getAllProperty, getSingleProperty, searchAndFilter} from "../controllers/propertyController.js"

const router = Router();

// routes
router.post("/", addProperty);
router.put("/:id", updateProperty);
router.delete("/:id", deleteProperty);
router.get('/properties', getAllProperty);
router.get('/properties/:propertyId', getSingleProperty);
router.get('/properties/search', searchAndFilter)

export default router;